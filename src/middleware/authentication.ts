import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../security/sessions.js';
import { UnauthorizedError } from '../utils/errors.js';
import { SecurityContext } from '../types/auth.js';

export async function requireAuthentication(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.sessionId;
    
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const session = await validateSession(token);
    
    if (!session) {
      res.clearCookie('sessionId');
      throw new UnauthorizedError('Invalid or expired session');
    }

    const securityContext: SecurityContext = {
      userId: session.userId,
      role: session.role,
      sessionId: session.id,
      requestId: (req as any).id as string,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    };

    (req as any).securityContext = securityContext;
    
    next();
  } catch (error) {
    next(error);
  }
}
