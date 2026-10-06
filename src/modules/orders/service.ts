// @ts-nocheck
import { prisma } from '../../database/prisma.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../../utils/errors.js';
import { Prisma } from '@prisma/client';
import { graphService } from '../../neo4j/graph.service.js';

export async function checkout(userId: string, shippingAddressId?: string) {
  const result = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Cart is empty', 'CART_EMPTY');
    }

    // Verify stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for product ${item.product.name}`, 'INSUFFICIENT_STOCK');
      }
    }

    // Group items by vendorId
    const vendorGroups: Record<string, typeof cart.items> = {};
    for (const item of cart.items) {
      const vId = item.product.vendorId;
      if (!vendorGroups[vId]) vendorGroups[vId] = [];
      vendorGroups[vId].push(item);
    }

    let totalAmount = new Prisma.Decimal(0);
    const vendorSubtotals: Record<string, Prisma.Decimal> = {};

    for (const [vId, items] of Object.entries(vendorGroups)) {
      let subtotal = new Prisma.Decimal(0);
      for (const item of items) {
        const itemTotal = item.product.price.mul(item.quantity);
        subtotal = subtotal.add(itemTotal);
      }
      vendorSubtotals[vId] = subtotal;
      totalAmount = totalAmount.add(subtotal);
    }

    const orderGroup = await tx.orderGroup.create({
      data: {
        customerId: userId,
        shippingAddressId,
        totalAmount,
        status: 'PENDING',
      },
    });
    
    const createdOrders = [];

    for (const [vId, items] of Object.entries(vendorGroups)) {
      const subtotal = vendorSubtotals[vId];
      
      const order = await tx.order.create({
        data: {
          orderGroupId: orderGroup.id,
          vendorId: vId,
          subtotal,
          status: 'PENDING',
        },
      });
      createdOrders.push(order);

      for (const item of items) {
        const productPrice = item.product.price;
        const subtotalItem = productPrice.mul(item.quantity);
        
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.product.name,
            productPrice: productPrice,
            quantity: item.quantity,
            subtotal: subtotalItem,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { orderGroup, createdOrders };
  });

  // Fire-and-forget sync to Neo4j graph outside of transaction
  for (const order of result.createdOrders) {
    graphService.syncOrderRelationship({
      customerId: userId,
      orderId: order.id,
      vendorId: order.vendorId,
    }).catch(console.error);
  }

  return result.orderGroup;
}

export async function getCustomerOrders(userId: string) {
  return prisma.orderGroup.findMany({
    where: { customerId: userId },
    include: {
      orders: {
        include: {
          items: true,
          vendor: true,
        },
      },
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVendorOrders(userId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { userId } });
  if (!vendor) {
    throw new NotFoundError('Vendor profile not found', 'VENDOR_NOT_FOUND');
  }

  return prisma.order.findMany({
    where: { vendorId: vendor.id },
    include: {
      items: true,
      orderGroup: {
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          shippingAddress: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(userId: string, orderId: string, status: any) {
  const vendor = await prisma.vendor.findUnique({ where: { userId } });
  if (!vendor) {
    throw new AuthorizationError('Only vendors can update order status', 'NOT_A_VENDOR');
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
  }

  if (order.vendorId !== vendor.id) {
    throw new AuthorizationError('You do not own this order', 'ORDER_NOT_OWNED');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
