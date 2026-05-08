import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as propertyService from './property.service';
import { propertyFilterSchema } from './property.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadImageToCloudinary } from '../../middlewares/upload.middleware';

export const createProperty = catchAsync(async (req: AuthRequest, res) => {
  console.log('=== DEBUG createProperty ===');
  console.log('req.files:', req.files);
  console.log('req.body keys:', Object.keys(req.body));
  
  const data = { ...req.body };
  
  // Handle images from file upload (Cloudinary)
  console.log('Checking req.files - type:', typeof req.files, 'isArray:', Array.isArray(req.files));
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    console.log('Files received:', req.files.length);
    const imageUrls = await Promise.all(
      (req.files as any[]).map(async (file: any) => {
        try {
          return await uploadImageToCloudinary(file.buffer, { folder: 'luxespace/properties' });
        } catch (error) {
          console.error('Failed to upload image to Cloudinary:', error);
          return null;
        }
      })
    );
    data.images = imageUrls.filter((url: string | null): url is string => !!url);
  }
  
  // Ensure required arrays are at least empty for Prisma/MongoDB
  if (!data.images || !Array.isArray(data.images)) {
    data.images = [];
  }

  if (!data.amenities || !Array.isArray(data.amenities)) {
    data.amenities = [];
  }

  // Ensure numeric values are actually numbers (in case validation transformation missed something)
  if (data.price) data.price = Number(data.price);
  if (data.bhk) data.bhk = Number(data.bhk);
  if (data.size) data.size = Number(data.size);

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
  const { id } = req.params;
  const data = { ...req.body };

  // Handle JSON stringified arrays from FormData
  if (data.amenities) {
    if (typeof data.amenities === 'string') {
      try {
        const parsed = JSON.parse(data.amenities);
        data.amenities = Array.isArray(parsed) ? parsed : [data.amenities];
      } catch (e) {
        data.amenities = [data.amenities];
      }
    } else if (!Array.isArray(data.amenities)) {
      data.amenities = [];
    }
  }

  // Handle existing images merging with new ones
  let finalImages: string[] = [];
  if (data.existingImages) {
    if (typeof data.existingImages === 'string') {
      try { finalImages = JSON.parse(data.existingImages); } catch (e) {}
    } else if (Array.isArray(data.existingImages)) {
      finalImages = data.existingImages;
    }
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImageUrls = (req.files as any[])
      .map((file: any) => file.path || file.secure_url)
      .filter((url: string) => !!url);
    finalImages = [...finalImages, ...newImageUrls];
  }

  if (finalImages.length > 0) {
    data.images = finalImages;
  }
  
  // Remove helper fields that aren't in the database schema
  delete data.existingImages;

  // Numeric conversion with safety
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.bhk !== undefined) data.bhk = Number(data.bhk);
  if (data.size !== undefined) data.size = Number(data.size);

  const result = await propertyService.updateProperty(
    id,
    data,
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
