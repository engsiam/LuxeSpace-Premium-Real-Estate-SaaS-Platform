import { Router } from 'express';

const router = Router();

// Import and use module routes
import userRoute from '../modules/user/user.route';
import propertyRoute from '../modules/property/property.route';
import bookingRoute from '../modules/booking/booking.route';
import reviewRoute from '../modules/review/review.route';
import blogRoute from '../modules/blog/blog.route';
import contactRoute from '../modules/contact/contact.route';
import aiRoute from '../modules/ai/ai.route';
import statsRoute from '../modules/stats.route';
import settingsRoute from '../modules/settings/settings.route';
import authRoute from '../modules/auth/auth.route';

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/properties', propertyRoute);
router.use('/bookings', bookingRoute);
router.use('/reviews', reviewRoute);
router.use('/blogs', blogRoute);
router.use('/contact', contactRoute);
router.use('/ai', aiRoute);
router.use('/stats', statsRoute);
router.use('/settings', settingsRoute);

export default router;
