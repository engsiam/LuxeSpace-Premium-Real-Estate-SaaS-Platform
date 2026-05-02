import { Router } from 'express';
import { authGuard } from '../middlewares/auth.middleware';
import { getStatsOverview } from './stats.controller';

const router = Router();

router.get('/overview', authGuard('ADMIN'), getStatsOverview);

export default router;
