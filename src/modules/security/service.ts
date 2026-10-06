import { prisma } from '../../database/prisma.js';
import { AppError } from '../../utils/errors.js';

export const listAuditLogs = async (query: any) => {
  const { page = 1, limit = 10, userId, action } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, page, limit };
};

export const listSecurityEvents = async (query: any) => {
  const { page = 1, limit = 10, userId, type } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (userId) where.userId = userId;
  if (type) where.type = type;

  const [events, total] = await Promise.all([
    prisma.securityEvent.findMany({
      where,
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
    }),
    prisma.securityEvent.count({ where }),
  ]);

  return { events, total, page, limit };
};

export const getSecurityEvent = async (id: string) => {
  const event = await prisma.securityEvent.findUnique({ where: { id } });
  if (!event) {
    throw new AppError('Security event not found', 404, 'EVENT_NOT_FOUND');
  }
  return event;
};
