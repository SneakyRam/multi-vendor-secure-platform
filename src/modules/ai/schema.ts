// @ts-nocheck
import { z } from 'zod';

export const AiChatInputSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().uuid('Invalid conversation ID format').optional(),
});

export type AiChatInput = z.infer<typeof AiChatInputSchema>;
