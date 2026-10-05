import { Request, Response, NextFunction } from 'express';
import { verifyCsrfToken } from '../security/csrf.js';
import { ForbiddenError } from '../utils/errors.js';

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'] as string;
    const securityContext = (req as any).securityContext;
    
    if (!securityContext?.sessionId) {
      return next(new ForbiddenError('CSRF protection requires authentication'));
    }
    
    if (!verifyCsrfToken(securityContext.sessionId, csrfToken)) {
      return next(new ForbiddenError('Invalid CSRF token'));
    }
  }
  
  next();
}
