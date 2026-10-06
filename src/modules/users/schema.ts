// @ts-nocheck
import { z } from 'zod';
import { UserStatus } from '@prisma/client';

export const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
