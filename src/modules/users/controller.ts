// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as userService from './service.js';
import { UserUpdateSchema } from './schema.js';
import { authorize } from '../../authorization/policy-engine.js';
import { ForbiddenError } from '../../utils/errors.js';

export async function getProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    
    let authorized = false;
    const selfAuth = authorize(req.securityContext!, 'profile:read:self', { id });
    if (selfAuth.decision === 'ALLOW') authorized = true;
    else {
      const adminAuth = authorize(req.securityContext!, 'user:read', { id });
      if (adminAuth.decision === 'ALLOW') authorized = true;
    }

    if (!authorized) {
      throw new ForbiddenError('Not allowed to read this profile');
    }

    const user = await userService.getProfile(id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = UserUpdateSchema.parse(req.body);

    let authorized = false;
    const selfAuth = authorize(req.securityContext!, 'profile:update:self', { id });
    if (selfAuth.decision === 'ALLOW') authorized = true;
    else {
      const adminAuth = authorize(req.securityContext!, 'user:update', { id });
      if (adminAuth.decision === 'ALLOW') authorized = true;
    }

    if (!authorized) {
      throw new ForbiddenError('Not allowed to update this profile');
    }

    const user = await userService.updateProfile(id, body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = authorize(req.securityContext!, 'user:read', null);
    if (auth.decision !== 'ALLOW') {
      throw new ForbiddenError('Not allowed to list users');
    }
    const users = await userService.listUsers(req.query);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}
