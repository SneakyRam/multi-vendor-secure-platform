import { prisma } from '../database/prisma.js';

export async function logAuditAction(
  actorId: string | null,
  actorRole: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null,
  requestId: string | null,
  ipAddress: string | null,
  metadata: any
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorRole,
        action,
        resourceType,
        resourceId,
        requestId,
        ipAddress,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    // Ensure audit logging never breaks application flow
    console.error('Failed to log audit action:', error);
  }
}
