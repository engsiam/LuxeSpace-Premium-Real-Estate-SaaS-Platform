import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as reviewController from './review.controller';

const router = Router();

router.post('/', authGuard('USER'), reviewController.createReview);
router.get('/property/:id', reviewController.getPropertyReviews);

export default router;
