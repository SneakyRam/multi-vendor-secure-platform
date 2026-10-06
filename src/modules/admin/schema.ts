// @ts-nocheck
import { z } from 'zod';

export const suspendUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const approveVendorSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
