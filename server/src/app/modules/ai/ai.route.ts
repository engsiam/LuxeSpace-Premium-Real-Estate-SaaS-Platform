import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as aiController from './ai.controller';

const router = Router();

router.post('/chat', authGuard(), aiController.chatWithAI);

export default router;
