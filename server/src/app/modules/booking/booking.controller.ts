import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as bookingService from './booking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const initiateBooking = catchAsync(async (req: AuthRequest, res) => {
  const { propertyId, visitDate } = req.body;
  const result = await bookingService.initiateBooking(
    req.user!.id,
    propertyId,
    visitDate
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking initiated. Redirecting to payment...',
    data: result,
  });
});

export const executeBooking = catchAsync(async (req, res) => {
  const { paymentID, method, invoice } = req.body;
  const result = await bookingService.executeBooking(paymentID, method, invoice);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.success ? 'Payment verified successfully' : 'Payment verification failed',
    data: result,
  });
});

export const getMyBookings = catchAsync(async (req: AuthRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await bookingService.getMyBookings(req.user!.id, page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved',
    data: result.bookings,
    meta: result.pagination,
  });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await bookingService.getAllBookings(page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings retrieved',
    data: result.bookings,
    meta: result.pagination,
  });
});

export const getTransactionHistory = catchAsync(async (req: AuthRequest, res) => {
  const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await bookingService.getTransactionHistory(userId, page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction history retrieved',
    data: result.transactions,
    meta: result.pagination,
  });
});
