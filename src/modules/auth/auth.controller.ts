// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { RegisterInputSchema, LoginInputSchema } from './auth.schema.js';
import { generateCsrfToken } from '../../security/csrf.js';
import { env } from '../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = RegisterInputSchema.parse(req.body);
    const { user, token } = await authService.register(input, req.ip, req.get('User-Agent'));

    res.cookie('sessionId', token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = LoginInputSchema.parse(req.body);
    const { user, token } = await authService.login(input, req.ip, req.get('User-Agent'));

    res.cookie('sessionId', token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function googleLoginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body;
    if (!input.token) {
      throw new Error('Google token is required');
    }
    const { user, token } = await authService.googleLogin(input.token, req.ip, req.get('User-Agent'));

    res.cookie('sessionId', token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.sessionId;
    if (token) {
      await authService.logout(token);
    }
    
    res.clearCookie('sessionId', { ...COOKIE_OPTIONS, maxAge: 0 });

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    next(error);
  }
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const securityContext = (req as any).securityContext;
    const userId = securityContext?.userId;
    if (!userId) {
      throw new Error('Security context missing');
    }

    const user = await authService.getMe(userId);

    res.status(200).json({
      success: true,
      data: {
        securityContext,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function csrfTokenHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const securityContext = (req as any).securityContext;
    const sessionId = securityContext?.sessionId;
    if (!sessionId) {
      throw new Error('Security context missing');
    }

    const csrfToken = generateCsrfToken(sessionId);

    res.status(200).json({
      success: true,
      data: { csrfToken },
    });
  } catch (error) {
    next(error);
  }
}
