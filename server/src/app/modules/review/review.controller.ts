import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as reviewService from './review.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createReview = catchAsync(async (req: AuthRequest, res) => {
  const { propertyId, rating, comment } = req.body;
  const result = await reviewService.createReview(
    req.user!.id,
    propertyId,
    rating,
    comment
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const getPropertyReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getPropertyReviews(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved',
    data: result,
  });
});
