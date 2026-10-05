import { z } from 'zod';

export const listLogsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 10)),
    userId: z.string().uuid().optional(),
    action: z.string().optional(),
  }),
});

export const getSecurityEventSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
