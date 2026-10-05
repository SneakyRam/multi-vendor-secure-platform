import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '../config/env.js';
import { requestIdMiddleware } from '../middleware/request-id.js';
import { errorHandler } from '../middleware/error-handler.js';
import { notFoundHandler } from '../middleware/not-found.js';
import routes from '../routes/index.js';
import logger from '../utils/logger.js';

const app = express();

// Security headers
app.use(helmet());

// CORS - configured from environment
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-CSRF-Token'],
  exposedHeaders: ['X-Request-ID']
}));

// Request ID
app.use(requestIdMiddleware);

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
      requestId: req.id,
    }, `${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

// Trust proxy (for correct IP behind reverse proxy)
app.set('trust proxy', 1);

// Routes
app.use(routes);

// 404 handler
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

export { app };
