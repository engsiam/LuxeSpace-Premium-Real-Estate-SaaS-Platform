import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as settingsController from './settings.controller';

const router = Router();

router.get('/', settingsController.getSettingsController);
router.patch('/', authGuard('ADMIN'), settingsController.updateSettingsController);

export default router;
