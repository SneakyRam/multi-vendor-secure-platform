import { Request, Response, NextFunction } from 'express';
import * as vendorService from './service.js';
import { VendorRegisterSchema, VendorUpdateSchema } from './schema.js';
import { authorize } from '../../authorization/policy-engine.js';
import { ForbiddenError } from '../../utils/errors.js';

export async function registerVendorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = VendorRegisterSchema.parse(req.body);
    const userId = req.securityContext!.userId;
    const vendor = await vendorService.registerVendor(userId, data);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
}

export async function getVendorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await vendorService.getVendor(req.params.id);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
}

export async function getVendorBySlugHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await vendorService.getVendorBySlug(req.params.slug);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = VendorUpdateSchema.parse(req.body);
    const vendorId = req.params.id;
    const vendor = await vendorService.getVendor(vendorId);

    let authorized = false;
    const selfAuth = authorize(req.securityContext!, 'vendor:profile:update:self', vendor);
    if (selfAuth.decision === 'ALLOW') authorized = true;
    else {
      const adminAuth = authorize(req.securityContext!, 'vendor:update', vendor);
      if (adminAuth.decision === 'ALLOW') authorized = true;
    }

    if (!authorized) {
      throw new ForbiddenError('Not allowed to update this vendor');
    }

    const updated = await vendorService.updateVendor(req.securityContext!.userId, vendorId, data);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function listVendorsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const isAdmin = req.securityContext?.role === 'ADMIN';
    const vendors = await vendorService.listVendors(req.query, isAdmin);
    res.json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
}

export async function approveVendorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const vendorId = req.params.id;
    const adminId = req.securityContext!.userId;
    const vendor = await vendorService.approveVendor(adminId, vendorId);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
}
