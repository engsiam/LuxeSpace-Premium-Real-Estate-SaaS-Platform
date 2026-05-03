import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as userService from './user.service';
import { registerSchema, loginSchema, updateUserSchema, adminUpdateUserSchema, googleAuthSchema } from './user.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const register = catchAsync(async (req, res) => {
  const validated = registerSchema.parse(req.body);
  const result = await userService.registerUser(validated);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const validated = loginSchema.parse(req.body);
  const result = await userService.loginUser(validated.email, validated.password);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const uploadAvatar = catchAsync(async (req: AuthRequest, res) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }
  const fileUrl = req.file.path;
  const result = await userService.updateUser(req.user!.id, { avatar: fileUrl });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Avatar uploaded successfully',
    data: result,
  });
});

export const googleAuth = catchAsync(async (req, res) => {
  const validated = googleAuthSchema.parse(req.body);
  const result = await userService.googleAuth(validated);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google authentication successful',
    data: result,
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await userService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved',
    data: users,
  });
});

export const getMe = catchAsync(async (req: AuthRequest, res) => {
  const user = await userService.getUserById(req.user!.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved',
    data: user,
  });
});

export const updateMe = catchAsync(async (req: AuthRequest, res) => {
  const validated = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(req.user!.id, validated);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated',
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const validated = adminUpdateUserSchema.parse(req.body);
  const user = await userService.updateUser(id, validated);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted',
  });
});
