import { Router } from 'express';
import healthRoutes from '../health/health.routes.js';

const router = Router();

router.use('/api/health', healthRoutes);

// Mounted in Batch N
// router.use('/api/auth', authRoutes)
// router.use('/api/users', userRoutes)
// router.use('/api/vendors', vendorRoutes)
// router.use('/api/categories', categoryRoutes)
// router.use('/api/products', productRoutes)
// router.use('/api/cart', cartRoutes)
// router.use('/api/orders', orderRoutes)
// router.use('/api/admin', adminRoutes)
// router.use('/api/security', securityRoutes)
// router.use('/api/risk', riskRoutes)
// router.use('/api/notifications', notificationRoutes)
// router.use('/api/ai', aiRoutes)

export default router;
