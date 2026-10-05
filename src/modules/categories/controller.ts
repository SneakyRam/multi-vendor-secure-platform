import { Request, Response, NextFunction } from 'express';
import * as categoryService from './service.js';
import { CategoryCreateSchema, CategoryUpdateSchema } from './schema.js';

export async function createCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CategoryCreateSchema.parse(req.body);
    const category = await categoryService.createCategory(data);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = CategoryUpdateSchema.parse(req.body);
    const category = await categoryService.updateCategory(req.params.id, data);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function listCategoriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoryService.listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
