// @ts-nocheck
import { Router } from 'express';
import { requireAuthentication } from '../../middleware/authentication.js';
import { requireRole } from '../../middleware/authorization.js';
import * as controller from './controller.js';

const router = Router();

router.use(requireAuthentication);

router.get('/', requireRole(['ADMIN']), controller.listUsersHandler);
router.get('/:id', controller.getProfileHandler);
router.put('/:id', controller.updateProfileHandler);

export default router;
