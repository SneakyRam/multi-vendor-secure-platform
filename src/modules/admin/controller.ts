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
