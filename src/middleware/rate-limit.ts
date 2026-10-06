// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { cacheIncr } from '../redis/cache.js';
import { RateLimitError } from '../utils/errors.js';

export function rateLimit(windowSeconds: number, maxRequests: number, keyPrefix: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket?.remoteAddress || 'unknown';
      const key = `ratelimit:${keyPrefix}:${ip}`;
      
      const count = await cacheIncr(key, windowSeconds);
      
      if (count > maxRequests) {
        throw new RateLimitError();
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}
