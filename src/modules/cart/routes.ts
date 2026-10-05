import { Router } from 'express';
import * as cartController from './controller.js';
import { authenticate } from '../../middleware/authentication.js';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', cartController.addItem);
router.put('/:id', cartController.updateItem);
router.delete('/:id', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
