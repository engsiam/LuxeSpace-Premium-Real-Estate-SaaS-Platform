import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as propertyController from './property.controller';
import { createPropertySchema, updatePropertySchema } from './property.validation';
import { validateRequest } from '../../middlewares/validate.middleware';
import prisma from '../../../prisma/client';

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

// AI Chat - Get recent properties in formatted way
router.get('/ai-recent', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'AVAILABLE' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        city: true,
        type: true,
        images: true,
        bhk: true,
        size: true,
      },
    });

    const formatted = properties.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price ? `৳${p.price.toLocaleString()}` : 'Contact for price',
      location: `${p.location}, ${p.city}`,
      type: p.type,
      image: p.images?.[0] || null,
      bhk: p.bhk,
      size: p.size,
    }));

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', propertyController.getPropertyById);

router.patch(
  '/:id',
  authGuard('AGENT', 'ADMIN'),
  upload.array('images', 5),
  validateRequest(updatePropertySchema),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  authGuard('AGENT', 'ADMIN'),
  propertyController.deleteProperty
);

export default router;
