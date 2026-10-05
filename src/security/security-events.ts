import { prisma } from '../database/prisma.js';
import { SecurityDecision } from '../types/security.js';
import { graphService } from '../neo4j/graph.service.js';

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
    const event = await prisma.securityEvent.create({
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

    // Fire-and-forget sync to Neo4j graph for relationship analysis
    graphService.syncSecurityEvent({
      id: event.id,
      actorId: event.actorId,
      action: event.action,
      decision: event.decision,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      timestamp: event.timestamp,
    }).catch(console.error);

    if (params.actorId && params.ipAddress) {
      graphService.syncDeviceRelationship({
        userId: params.actorId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent || null,
      }).catch(console.error);
    }

  } catch (error) {
    // Fail silently to prevent breaking application flow
    console.error('Failed to log security event:', error);
  }
}
