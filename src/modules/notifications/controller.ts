// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as notificationService from './service.js';

export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.securityContext.userId;
    const data = await notificationService.getUserNotifications(userId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.securityContext.userId;
    const { id } = req.params;
    await notificationService.markAsRead(userId, id);
    res.json({ success: true, data: { message: 'Notification marked as read' } });
  } catch (error) {
    next(error);
  }
};
