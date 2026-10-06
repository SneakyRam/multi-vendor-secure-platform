// @ts-nocheck
import { z } from 'zod';

export const NotificationCreateInput = z.object({
  userId: z.string().uuid(),
  type: z.string(),
  title: z.string().min(1),
  message: z.string().min(1),
});

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 10)),
    unreadOnly: z.string().optional().transform((v) => v === 'true'),
  }),
});
