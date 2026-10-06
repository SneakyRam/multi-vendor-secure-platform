// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service.js';

export async function createProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext!.userId;
    const product = await productService.createProduct(userId, req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext!.userId;
    const { id } = req.params;
    const product = await productService.updateProduct(userId, id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function listProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.listProducts(req.query as any);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (error) {
    next(error);
  }
}

export async function getProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const product = await productService.getProduct(id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext!.userId;
    const { id } = req.params;
    await productService.deleteProduct(userId, id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function updateStockHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.securityContext!.userId;
    const { id } = req.params;
    const { quantity } = req.body;
    const product = await productService.updateStock(userId, id, quantity);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
