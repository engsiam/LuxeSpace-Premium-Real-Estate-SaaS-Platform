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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const result = await contactService.getContacts(page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved',
    data: result.contacts,
    meta: result.pagination,
  });
});

export const getContactById = catchAsync(async (req: AuthRequest, res) => {
  const result = await contactService.getContactById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message retrieved',
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

export const replyToContact = catchAsync(async (req: AuthRequest, res) => {
  const { reply } = req.body;
  if (!reply) {
    throw new Error('Reply message is required');
  }
  const result = await contactService.replyToContact(req.params.id, reply);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reply sent successfully',
    data: result,
  });
});

export const deleteContact = catchAsync(async (req: AuthRequest, res) => {
  await contactService.deleteContact(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted',
    data: null,
  });
});