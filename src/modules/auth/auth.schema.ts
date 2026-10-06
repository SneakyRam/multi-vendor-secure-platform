import { z } from 'zod';

export const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
  role: z.enum(['CUSTOMER', 'VENDOR', 'ADMIN']).default('CUSTOMER'),
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const GoogleLoginInputSchema = z.object({
  token: z.string(),
});

export type GoogleLoginInput = z.infer<typeof GoogleLoginInputSchema>;
