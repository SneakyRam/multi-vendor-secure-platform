// @ts-nocheck
import { Router } from 'express';
import * as adminController from './controller.js';
import { requireAuth, requireRole } from '../../middleware/authentication.js';
import { validateRequest } from '../../middleware/validation.js';
import { suspendUserSchema, approveVendorSchema } from './schema.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/stats', adminController.getDashboardStats);

router.post('/users/:id/suspend', validateRequest(suspendUserSchema), adminController.suspendUser);

router.post('/vendors/:id/approve', validateRequest(approveVendorSchema), adminController.approveVendor);

router.get('/graph', adminController.getGraph);
router.get('/events', adminController.getEvents);

export default router;
