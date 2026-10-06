// @ts-nocheck
import { Router } from 'express';
import * as securityController from './controller.js';
import { requireAuth, requireRole } from '../../middleware/authentication.js';
import { validateRequest } from '../../middleware/validation.js';
import { listLogsSchema, getSecurityEventSchema } from './schema.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/audit', validateRequest(listLogsSchema), securityController.listAuditLogs);
router.get('/events', validateRequest(listLogsSchema), securityController.listSecurityEvents);
router.get('/events/:id', validateRequest(getSecurityEventSchema), securityController.getSecurityEvent);

export default router;
