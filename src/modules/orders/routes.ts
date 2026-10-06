// @ts-nocheck
import { Router } from 'express';
import * as ordersController from './controller.js';
import { authenticate } from '../../middleware/authentication.js';
import { requireRole } from '../../middleware/authorization.js';

const router = Router();

router.use(authenticate);

router.post('/checkout', ordersController.checkout);
router.get('/customer', ordersController.getCustomerOrders);

router.get('/vendor', requireRole(['VENDOR']), ordersController.getVendorOrders);
router.patch('/vendor/:id/status', requireRole(['VENDOR']), ordersController.updateOrderStatus);

export default router;
