// @ts-nocheck
import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.id || req.headers['x-request-id'] || 'unknown';
  
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      requestId
    }
  });
};
