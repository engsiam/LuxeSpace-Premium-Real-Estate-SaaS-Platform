import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as bookingController from './booking.controller';

const router = Router();

router.post('/init', authGuard('USER'), bookingController.initiateBooking);
router.post('/execute', authGuard('USER'), bookingController.executeBooking);
router.post('/callback', bookingController.bkashCallback);
router.get('/', authGuard(), bookingController.getMyBookings);
router.get('/all', authGuard('ADMIN'), bookingController.getAllBookings);

export default router;
