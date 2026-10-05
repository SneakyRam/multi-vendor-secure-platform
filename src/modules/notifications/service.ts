import { prisma } from '../../database/prisma.js';
import { AppError } from '../../utils/errors.js';

export const createNotification = async (userId: string, type: string, title: string, message: string) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      isRead: false,
    },
  });
  return notification;
};

export const getUserNotifications = async (userId: string, query: any) => {
  const { page = 1, limit = 10, unreadOnly } = query;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (unreadOnly) where.isRead = false;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total, page, limit };
};

export const markAsRead = async (userId: string, id: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return { success: true };
};
