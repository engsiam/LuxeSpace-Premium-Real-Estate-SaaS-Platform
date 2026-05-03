import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as bookingController from './booking.controller';

const router = Router();

router.post('/init', authGuard('USER', 'ADMIN', 'AGENT'), bookingController.initiateBooking);
router.post('/execute', authGuard('USER', 'ADMIN', 'AGENT'), bookingController.executeBooking);
router.get('/', authGuard(), bookingController.getMyBookings);
router.get('/transactions', authGuard(), bookingController.getTransactionHistory);
router.get('/all', authGuard('ADMIN'), bookingController.getAllBookings);

export default router;
