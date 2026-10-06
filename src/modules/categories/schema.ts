// @ts-nocheck
import { z } from 'zod';

export const CategoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional(),
});
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
