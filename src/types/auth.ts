// @ts-nocheck
export enum Role {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface SecurityContext {
  userId: string;
  role: Role;
  sessionId: string;
  requestId: string;
  ipAddress: string;
  userAgent: string;
}

export interface SessionData {
  id: string;
  userId: string;
  role: Role;
  createdAt: Date;
  expiresAt: Date;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

declare global {
  namespace Express {
    interface Request {
      securityContext?: SecurityContext;
    }
  }
}
