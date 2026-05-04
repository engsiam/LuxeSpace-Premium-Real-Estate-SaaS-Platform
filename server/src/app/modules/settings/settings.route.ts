import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as settingsController from './settings.controller';
import { uploadVideo } from '../../middlewares/upload.middleware';

const router = Router();

router.get('/', settingsController.getSettingsController);
router.patch('/', authGuard('ADMIN'), settingsController.updateSettingsController);
router.post('/herovideos', authGuard('ADMIN'), uploadVideo.array('videos', 5), settingsController.uploadHeroVideos);

export default router;
