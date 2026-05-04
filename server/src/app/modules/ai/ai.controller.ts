import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as aiService from './ai.service';

export const chatWithAI = catchAsync(async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Prompt is required',
      data: null,
    });
    return;
  }

  const response = await aiService.chatWithAI(prompt);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'AI response generated',
    data: { response },
  });
});
