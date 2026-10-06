// @ts-nocheck
import { prisma } from '../../database/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export async function getCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function addItem(userId: string, productId: string, quantity: number) {
  const cart = await getCart(userId);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new NotFoundError('Product not found', 'PRODUCT_NOT_FOUND');
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
}

export async function updateItem(userId: string, cartItemId: string, quantity: number) {
  const cart = await getCart(userId);

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.cartId !== cart.id) {
    throw new NotFoundError('Cart item not found in your cart', 'CART_ITEM_NOT_FOUND');
  }

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeItem(userId: string, cartItemId: string) {
  const cart = await getCart(userId);

  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.cartId !== cart.id) {
    throw new NotFoundError('Cart item not found in your cart', 'CART_ITEM_NOT_FOUND');
  }

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

export async function clearCart(userId: string) {
  const cart = await getCart(userId);

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}
