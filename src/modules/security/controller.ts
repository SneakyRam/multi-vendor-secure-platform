// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as securityService from './service.js';

export const listAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await securityService.listAuditLogs(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const listSecurityEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await securityService.listSecurityEvents(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSecurityEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await securityService.getSecurityEvent(id);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};
