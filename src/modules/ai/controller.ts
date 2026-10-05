import { Request, Response } from 'express';
import { AiChatInputSchema } from './schema.js';
import { handleChat } from './service.js';

export async function chatController(req: Request, res: Response) {
  try {
    const securityContext = (req as any).securityContext;
    if (!securityContext) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing security context', requestId: req.headers['x-request-id'] as string || 'unknown' }
      });
    }

    const validation = AiChatInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.errors,
          requestId: req.headers['x-request-id'] as string || 'unknown'
        }
      });
    }

    const { message, conversationId } = validation.data;
    
    const result = await handleChat(securityContext, message, conversationId);

    return res.status(200).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    req.log?.error({ err: error }, 'Error in AI chat controller');
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred processing chat', requestId: req.headers['x-request-id'] as string || 'unknown' }
    });
  }
}
