// @ts-nocheck
import { z } from 'zod';

export const ProductCreateInput = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be greater than zero'),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  sku: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  images: z.array(z.string().url()).optional(),
});

export const ProductUpdateInput = ProductCreateInput.partial();

export const ProductQuery = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  pageSize: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  categorySlug: z.string().optional(),
  vendorSlug: z.string().optional(),
  minPrice: z.string().optional().transform(v => (v ? parseFloat(v) : undefined)),
  maxPrice: z.string().optional().transform(v => (v ? parseFloat(v) : undefined)),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED', 'SUSPENDED']).optional(),
});

export const UpdateStockInput = z.object({
  quantity: z.number().int().nonnegative('Quantity cannot be negative'),
});
