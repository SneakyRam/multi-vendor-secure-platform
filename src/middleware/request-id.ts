import { Request, Response, NextFunction } from 'express';
import { generateId } from '../utils/ids.js';

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] as string;
  let id = '';

  if (reqId && /^[a-zA-Z0-9-]{1,64}$/.test(reqId)) {
    id = reqId;
  } else {
    id = generateId();
  }

  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
};
