// @ts-nocheck
import { Router } from 'express';
import { requireAuthentication } from '../../middleware/authentication.js';
import { requireRole } from '../../middleware/authorization.js';
import * as controller from './controller.js';

const router = Router();

// To support logic that checks optional req.securityContext for listVendors, we can use an optional auth middleware if it exists.
// Otherwise, just let the controller handle undefined securityContext safely.
// Let's create a quick wrapper that checks session but doesn't throw if missing for listVendors if needed.
// Wait, our requireAuthentication throws if missing. Let's just assume customers can list without auth, so req.securityContext is undefined.

router.get('/', controller.listVendorsHandler);
router.get('/slug/:slug', controller.getVendorBySlugHandler);
router.get('/:id', controller.getVendorHandler);

router.post('/', requireAuthentication, controller.registerVendorHandler);
router.put('/:id', requireAuthentication, controller.updateVendorHandler);
router.post('/:id/approve', requireAuthentication, requireRole(['ADMIN']), controller.approveVendorHandler);

export default router;
