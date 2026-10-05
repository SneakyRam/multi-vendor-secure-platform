import { Router } from 'express';
import * as riskController from './controller.js';
import { requireAuth, requireRole } from '../../middleware/authentication.js';
import { validateRequest } from '../../middleware/validation.js';
import { evaluateRiskSchema } from './schema.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/evaluate/:type/:id', validateRequest(evaluateRiskSchema), riskController.evaluateRisk);

export default router;
