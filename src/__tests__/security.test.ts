import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express, { Request, Response, NextFunction } from 'express';

// Mock dependencies
vi.mock('../database/prisma.js', () => ({
  default: {}
}));

// We will build a small mock app to test the middlewares
import { requireAuthentication, requireRole } from '../middleware/authentication.js';
import { notFoundHandler, errorHandler } from '../middleware/error-handler.js';

describe('Security Middlewares', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Middleware to simulate session population
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Mock session extraction based on headers for testing
      const role = req.headers['x-mock-role'] as string;
      const userId = req.headers['x-mock-userid'] as string;
      if (role || userId) {
        (req as any).securityContext = {
          userId: userId || 'mock-user-id',
          role: role || 'CUSTOMER',
          sessionId: 'mock-session-id',
          requestId: 'mock-request-id',
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.get('User-Agent') || 'test'
        };
      }
      next();
    });

    app.get('/api/protected', requireAuthentication, (req: Request, res: Response) => {
      res.json({ success: true, data: { message: 'Protected resource' } });
    });

    app.get('/api/admin', requireAuthentication, requireRole(['ADMIN']), (req: Request, res: Response) => {
      res.json({ success: true, data: { message: 'Admin resource' } });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  it('should return 401 UNAUTHENTICATED when accessing a protected route without a session', async () => {
    const response = await supertest(app).get('/api/protected');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('should return 403 FORBIDDEN when accessing an ADMIN route with a CUSTOMER session', async () => {
    const response = await supertest(app)
      .get('/api/admin')
      .set('x-mock-userid', 'user1')
      .set('x-mock-role', 'CUSTOMER');
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('should return 404 NOT_FOUND when accessing an unmapped route', async () => {
    const response = await supertest(app).get('/api/this-route-does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
  
  it('should allow access to protected route with valid session', async () => {
    const response = await supertest(app)
      .get('/api/protected')
      .set('x-mock-userid', 'user1')
      .set('x-mock-role', 'CUSTOMER');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
