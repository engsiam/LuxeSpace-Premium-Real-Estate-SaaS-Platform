import { Router } from 'express';
import * as aiController from './ai.controller';
import { rateLimiter } from '../../middlewares/rateLimiter';
import { validateRequest } from '../../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  prompt: z.string({
    required_error: 'Prompt is required',
  }).min(1, 'Prompt cannot be empty'),
});

router.post(
  '/chat',
  rateLimiter(10, 60000), // 10 requests per minute
  validateRequest(chatSchema),
  aiController.chatWithAI
);

export default router;
