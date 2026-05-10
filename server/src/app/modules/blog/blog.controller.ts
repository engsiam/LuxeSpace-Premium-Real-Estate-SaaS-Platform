import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as blogService from './blog.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createBlog = catchAsync(async (req: AuthRequest, res) => {
  const result = await blogService.createBlog(req.body, req.user!.id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

export const getBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getBlogs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved',
    data: result.data,
    meta: result.pagination,
  });
});

export const getBlogBySlug = catchAsync(async (req, res) => {
  const result = await blogService.getBlogBySlug(req.params.slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog retrieved',
    data: result,
  });
});

export const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getAllBlogs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All blogs retrieved',
    data: result,
  });
});

export const updateBlog = catchAsync(async (req: AuthRequest, res) => {
  const result = await blogService.updateBlog(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

export const deleteBlog = catchAsync(async (req: AuthRequest, res) => {
  await blogService.deleteBlog(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: null,
  });
});
