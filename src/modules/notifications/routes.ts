import { Router } from 'express';
import * as notificationController from './controller.js';
import { requireAuth } from '../../middleware/authentication.js';
import { validateRequest } from '../../middleware/validation.js';
import { getNotificationsSchema, markAsReadSchema } from './schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', validateRequest(getNotificationsSchema), notificationController.getUserNotifications);
router.patch('/:id/read', validateRequest(markAsReadSchema), notificationController.markAsRead);

export default router;
