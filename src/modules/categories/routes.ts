// @ts-nocheck
import { Router } from 'express';
import { requireAuthentication } from '../../middleware/authentication.js';
import { requireRole } from '../../middleware/authorization.js';
import * as controller from './controller.js';

const router = Router();

router.get('/', controller.listCategoriesHandler);
router.get('/:slug', controller.getCategoryHandler);

router.post('/', requireAuthentication, requireRole(['ADMIN']), controller.createCategoryHandler);
router.put('/:id', requireAuthentication, requireRole(['ADMIN']), controller.updateCategoryHandler);
router.delete('/:id', requireAuthentication, requireRole(['ADMIN']), controller.deleteCategoryHandler);

export default router;
