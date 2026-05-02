import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as aiService from './ai.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const chatWithAI = catchAsync(async (req: AuthRequest, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  const response = await aiService.chatWithAI(prompt);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AI response generated',
    data: { response },
  });
});
