// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as adminService from './service.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await adminService.suspendUser(id);
    res.json({ success: true, data: { message: 'User suspended successfully' } });
  } catch (error) {
    next(error);
  }
};

export const approveVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await adminService.approveVendor(id);
    res.json({ success: true, data: { message: 'Vendor approved successfully' } });
  } catch (error) {
    next(error);
  }
};

export const getGraph = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query;
    const graphData = await adminService.getGlobalGraph(limit ? parseInt(limit as string, 10) : 100);
    res.json({ success: true, data: graphData });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query;
    const events = await adminService.getSecurityEvents(limit ? parseInt(limit as string, 10) : 50);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const seedGraph = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.seedDummyData();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
