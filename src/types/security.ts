// @ts-nocheck
export type SecurityDecision = 'ALLOW' | 'DENY';

export type SecurityEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PRICE_TAMPERING_ATTEMPT'
  | 'UNAUTHORIZED_ACCESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSignal {
  signal: string;
  score: number;
  timestamp: Date;
  details?: string;
}

export interface RiskAssessment {
  entityId: string;
  entityType: string;
  score: number;
  level: RiskLevel;
  signals: RiskSignal[];
}

export type AuditAction = 
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'ORDER_PLACED'
  | 'ORDER_CANCELLED'
  | 'ORDER_FULFILLED'
  | 'ROLE_CHANGED'
  | 'PERMISSION_GRANTED'
  | 'PERMISSION_REVOKED';
