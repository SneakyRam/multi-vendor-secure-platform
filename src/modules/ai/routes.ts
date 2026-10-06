// @ts-nocheck
import { Router } from 'express';
import { chatController } from './controller.js';
import { authenticate } from '../../middleware/authentication.js';

const router = Router();

router.post('/chat', authenticate, chatController);

export default router;
