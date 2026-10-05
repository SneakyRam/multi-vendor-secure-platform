import { Request, Response, NextFunction } from 'express';
import * as ordersService from './service.js';
import { OrderCreateInput, OrderStatusUpdateInput } from './schema.js';

export async function checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const { shippingAddressId } = OrderCreateInput.parse(req.body);
    
    const orderGroup = await ordersService.checkout(userId, shippingAddressId);
    res.json({ success: true, data: orderGroup });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const orders = await ordersService.getCustomerOrders(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function getVendorOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const orders = await ordersService.getVendorOrders(userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const orderId = req.params.id;
    const { status } = OrderStatusUpdateInput.parse(req.body);
    
    const updatedOrder = await ordersService.updateOrderStatus(userId, orderId, status);
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
}
