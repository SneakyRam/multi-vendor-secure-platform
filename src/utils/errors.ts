// @ts-nocheck
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', code: string = 'BAD_REQUEST') {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHENTICATED') {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  public reason?: string;
  constructor(message: string = 'Forbidden', code: string = 'FORBIDDEN', reason?: string) {
    super(message, 403, code);
    this.reason = reason;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found', code: string = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

export class ValidationError extends AppError {
  public details: any;
  constructor(message: string = 'Validation Error', code: string = 'VALIDATION_ERROR', details?: any) {
    super(message, 422, code);
    this.details = details;
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate Limit Exceeded', code: string = 'RATE_LIMITED') {
    super(message, 429, code);
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Internal Server Error', code: string = 'INTERNAL_ERROR') {
    super(message, 500, code, false);
  }
}

export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_SESSION_REVOKED: 'AUTH_SESSION_REVOKED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  CROSS_VENDOR_ACCESS: 'CROSS_VENDOR_ACCESS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PRICE_TAMPERING_DETECTED: 'PRICE_TAMPERING_DETECTED',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PRODUCT_NOT_ACTIVE: 'PRODUCT_NOT_ACTIVE',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
} as const;
