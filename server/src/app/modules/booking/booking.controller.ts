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
    message: 'Booking initiated',
    data: result,
  });
});

export const executeBooking = catchAsync(async (req, res) => {
  const { paymentID } = req.body;
  const result = await bookingService.executeBooking(paymentID);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment executed',
    data: result,
  });
});

export const getMyBookings = catchAsync(async (req: AuthRequest, res) => {
  const result = await bookingService.getMyBookings(req.user!.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved',
    data: result,
  });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings retrieved',
    data: result,
  });
});
