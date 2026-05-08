import { Response } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as userService from './user.service';
import { registerSchema, loginSchema, updateUserSchema, adminUpdateUserSchema, googleAuthSchema } from './user.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadImageToCloudinary } from '../../middlewares/upload.middleware';
import env from '../../../config';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const register = catchAsync(async (req, res) => {
  const validated = registerSchema.parse(req.body);
  const { accessToken, refreshToken, user } = await userService.registerUser(validated);
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: { user },
  });
});

export const login = catchAsync(async (req, res) => {
  const validated = loginSchema.parse(req.body);
  const { accessToken, refreshToken, user } = await userService.loginUser(validated.email, validated.password);
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: { user },
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
  
  const fileUrl = await uploadImageToCloudinary(req.file.buffer, { folder: 'luxespace/avatars' });
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
  const { accessToken, refreshToken, user } = await userService.googleAuth(validated);
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google authentication successful',
    data: { user },
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  const refreshTokenFromBody = req.body?.refreshToken;
  const result = await userService.refreshToken(refreshTokenFromCookie || refreshTokenFromBody);
  
  if (result.accessToken) {
    res.cookie('accessToken', result.accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

export const getSession = catchAsync(async (req, res) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'No session',
      data: { user: null, isAuthenticated: false },
    });
  }
  
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
    const user = await userService.getUserById(decoded.id);
    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Session active',
      data: { user, isAuthenticated: true },
    });
  } catch {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Invalid session',
      data: { user: null, isAuthenticated: false },
    });
  }
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie('accessToken', { ...cookieOptions });
  res.clearCookie('refreshToken', { ...cookieOptions });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await userService.getUsers(page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved',
    data: result.users,
    meta: result.pagination,
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
