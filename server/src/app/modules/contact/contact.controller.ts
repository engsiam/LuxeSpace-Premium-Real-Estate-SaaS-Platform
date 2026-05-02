import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as contactService from './contact.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const submitContact = catchAsync(async (req, res) => {
  const result = await contactService.submitContact(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const getContacts = catchAsync(async (req: AuthRequest, res) => {
  const result = await contactService.getContacts();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved',
    data: result,
  });
});

export const markAsRead = catchAsync(async (req, res) => {
  const result = await contactService.markAsRead(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message marked as read',
    data: result,
  });
});
