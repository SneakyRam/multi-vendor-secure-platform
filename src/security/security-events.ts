import { prisma } from '../database/prisma.js';
import { SecurityDecision } from '../types/security.js';

export async function logSecurityEvent(params: {
  actorId?: string;
  actorRole?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  decision: SecurityDecision;
  reason?: string;
  riskScore?: number;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        actorId: params.actorId || null,
        actorRole: params.actorRole || null,
        action: params.action,
        resourceType: params.resourceType || null,
        resourceId: params.resourceId || null,
        decision: params.decision,
        reason: params.reason || null,
        riskScore: params.riskScore || null,
        requestId: params.requestId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    // Fail silently to prevent breaking application flow
    console.error('Failed to log security event:', error);
  }
}
