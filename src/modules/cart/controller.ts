import { Request, Response, NextFunction } from 'express';
import * as cartService from './service.js';
import { CartItemInput } from './schema.js';

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const cart = await cartService.getCart(userId);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const { productId, quantity } = CartItemInput.parse(req.body);
    const item = await cartService.addItem(userId, productId, quantity);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const cartItemId = req.params.id;
    const { quantity } = CartItemInput.pick({ quantity: true }).parse(req.body);
    const item = await cartService.updateItem(userId, cartItemId, quantity);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    const cartItemId = req.params.id;
    await cartService.removeItem(userId, cartItemId);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext.userId;
    await cartService.clearCart(userId);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
