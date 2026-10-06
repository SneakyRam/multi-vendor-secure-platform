// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import * as riskService from './service.js';

export const evaluateRisk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params;
    const evaluation = await riskService.evaluateEntityRisk(id, type as any);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
};
