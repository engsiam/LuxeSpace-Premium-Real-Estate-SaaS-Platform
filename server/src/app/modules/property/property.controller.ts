import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as propertyService from './property.service';
import { propertyFilterSchema } from './property.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createProperty = catchAsync(async (req: AuthRequest, res) => {
  const data = { ...req.body };
  
  // Convert string values to numbers
  if (data.price) data.price = parseFloat(data.price);
  if (data.bhk) data.bhk = parseInt(data.bhk);
  if (data.size) data.size = parseInt(data.size);
  
  // Handle images from file upload
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    data.images = (req.files as any[]).map((file: any) => file.path || file.secure_url);
  }
  
  // Ensure images is at least an empty array
  if (!data.images) {
    data.images = [];
  }

  const result = await propertyService.createProperty(data, req.user!.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property created successfully',
    data: result,
  });
});


export const getProperties = catchAsync(async (req, res) => {
  const filters = propertyFilterSchema.parse(req.query);
  const result = await propertyService.getProperties(filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const getPropertyById = catchAsync(async (req, res) => {
  const result = await propertyService.getPropertyById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property retrieved successfully',
    data: result,
  });
});

export const updateProperty = catchAsync(async (req: AuthRequest, res) => {
  const result = await propertyService.updateProperty(
    req.params.id,
    req.body,
    req.user!.id,
    req.user!.role
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

export const deleteProperty = catchAsync(async (req: AuthRequest, res) => {
  await propertyService.deleteProperty(req.params.id, req.user!.id, req.user!.role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
  });
});

export const getFeaturedProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getFeaturedProperties();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Featured properties retrieved',
    data: result,
  });
});

export const getPropertiesByCity = catchAsync(async (req, res) => {
  const result = await propertyService.getPropertiesByCity();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties by city retrieved',
    data: result,
  });
});
