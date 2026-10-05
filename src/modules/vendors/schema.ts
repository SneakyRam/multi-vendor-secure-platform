import { z } from 'zod';

export const VendorRegisterSchema = z.object({
  businessName: z.string().min(2),
  description: z.string().optional(),
});
export type VendorRegisterInput = z.infer<typeof VendorRegisterSchema>;

export const VendorUpdateSchema = z.object({
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
});
export type VendorUpdateInput = z.infer<typeof VendorUpdateSchema>;
