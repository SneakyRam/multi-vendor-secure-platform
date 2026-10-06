// @ts-nocheck
import { z } from 'zod';

export const evaluateRiskSchema = z.object({
  params: z.object({
    type: z.enum(['user', 'vendor', 'order']),
    id: z.string().uuid(),
  }),
});
