// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { hasPermission } from '../authorization/permissions.js';
import { ForbiddenError } from '../utils/errors.js';

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const securityContext = req.securityContext;
    if (!securityContext) {
      return next(new ForbiddenError('Missing security context'));
    }

    if (!roles.includes(securityContext.role)) {
      return next(new ForbiddenError(`Access denied for role ${securityContext.role}`));
    }
    next();
  };
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const securityContext = req.securityContext;
    if (!securityContext) {
      return next(new ForbiddenError('Missing security context'));
    }

    if (!hasPermission(securityContext.role, permission)) {
      return next(new ForbiddenError(`Missing required permission: ${permission}`));
    }
    next();
  };
}
