// @ts-nocheck
import { Router } from 'express';
import { validate } from '../../middleware/validation.js';
import { requireAuthentication } from '../../middleware/authentication.js';
import { requireRole } from '../../middleware/authorization.js';
import { ProductCreateInput, ProductUpdateInput, ProductQuery, UpdateStockInput } from './product.schema.js';
import * as productController from './product.controller.js';

const router = Router();

router.get('/', validate({ query: ProductQuery }), productController.listProductsHandler);
router.get('/:id', productController.getProductHandler);

router.post(
  '/',
  requireAuthentication,
  requireRole(['VENDOR']),
  validate({ body: ProductCreateInput }),
  productController.createProductHandler
);

router.put(
  '/:id',
  requireAuthentication,
  requireRole(['VENDOR']),
  validate({ body: ProductUpdateInput }),
  productController.updateProductHandler
);

router.delete(
  '/:id',
  requireAuthentication,
  requireRole(['VENDOR']),
  productController.deleteProductHandler
);

router.patch(
  '/:id/stock',
  requireAuthentication,
  requireRole(['VENDOR']),
  validate({ body: UpdateStockInput }),
  productController.updateStockHandler
);

export default router;
