import { prisma } from '../../database/prisma.js';

export const evaluateEntityRisk = async (entityId: string, type: 'user' | 'vendor' | 'order') => {
  // Mock risk evaluation logic for now
  
  // Find related security events for the entity
  const events = await prisma.securityEvent.findMany({
    where: {
      actorId: type === 'user' || type === 'vendor' ? entityId : undefined,
    },
    orderBy: { timestamp: 'desc' },
    take: 10,
  });

  let score = 0;
  if (events.length > 5) score += 50;
  else if (events.length > 2) score += 30;

  return {
    entityId,
    entityType: type,
    riskScore: score,
    level: score > 75 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW',
    factors: [
      { name: 'Recent Security Events', count: events.length },
    ],
  };
};
