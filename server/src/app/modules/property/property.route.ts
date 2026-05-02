import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as propertyController from './property.controller';
import { createPropertySchema } from './property.validation';
import { validateRequest } from '../../middlewares/validate.middleware';

const router = Router();

import { upload } from '../../middlewares/upload.middleware';

router.post(
  '/',
  authGuard('AGENT', 'ADMIN'),
  upload.array('images', 5),
  validateRequest(createPropertySchema),
  propertyController.createProperty
);


router.get('/', propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/by-city', propertyController.getPropertiesByCity);
router.get('/:id', propertyController.getPropertyById);

router.patch(
  '/:id',
  authGuard('AGENT', 'ADMIN'),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  authGuard('AGENT', 'ADMIN'),
  propertyController.deleteProperty
);

export default router;
