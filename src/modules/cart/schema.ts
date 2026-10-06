// @ts-nocheck
import { z } from 'zod';

export const CartItemInput = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});
