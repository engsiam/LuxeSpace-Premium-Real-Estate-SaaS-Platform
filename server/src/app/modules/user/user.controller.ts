import { Response } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import * as userService from './user.service';
import { registerSchema, loginSchema, updateUserSchema, adminUpdateUserSchema, googleAuthSchema } from './user.validation';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadImageToCloudinary } from '../../middlewares/upload.middleware';
import env, { getClientUrl, getServerUrl } from '../../../config';
import { getCookieOptions, getCrossDomainCookieOptions, cookieOptions } from '../../utils/cookie';

export const register = catchAsync(async (req, res) => {
  const validated = registerSchema.parse(req.body);
  const { accessToken, refreshToken, user } = await userService.registerUser(validated);

  res.cookie(
    'accessToken',
    accessToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 7)
  );
  res.cookie(
    'refreshToken',
    refreshToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 30)
  );

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

  res.cookie(
    'accessToken',
    accessToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 7)
  );
  res.cookie(
    'refreshToken',
    refreshToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 30)
  );

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

  res.cookie(
    'accessToken',
    accessToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 7)
  );
  res.cookie(
    'refreshToken',
    refreshToken,
    getCrossDomainCookieOptions(60 * 60 * 24 * 30)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google authentication successful',
    data: { user },
  });
});

export const googleAuthCallback = catchAsync(async (req, res) => {
  const { code, error } = req.query;
  const clientUrl = getClientUrl();

  if (error) {
    return res.redirect(`${clientUrl}/login?error=${error}`);
  }

  if (!code) {
    return res.redirect(`${clientUrl}/login?error=no_code`);
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const serverUrl = getServerUrl();
    const redirectUri = `${serverUrl}/api/v1/users/auth/google/callback`;

    if (!googleClientId || !googleClientSecret || googleClientId === 'your-google-client-id') {
      return res.redirect(`${clientUrl}/login?error=google_not_configured`);
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json() as { access_token?: string };

    if (!tokens.access_token) {
      return res.redirect(`${clientUrl}/login?error=token_exchange_failed`);
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json() as { email?: string; name?: string; picture?: string };

    const { accessToken, refreshToken, user } = await userService.googleAuth({
      email: googleUser.email || '',
      name: googleUser.name || '',
      avatar: googleUser.picture || '',
      role: 'USER',
    });

    res.cookie('accessToken', accessToken, {
      ...getCrossDomainCookieOptions(60 * 60 * 24 * 7),
    });
    res.cookie('refreshToken', refreshToken, {
      ...getCrossDomainCookieOptions(60 * 60 * 24 * 30),
    });

    res.redirect(`${clientUrl}/dashboard/user`);
  } catch (err) {
    console.error('Google auth callback error:', err);
    res.redirect(`${clientUrl}/login?error=auth_failed`);
  }
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  const refreshTokenFromBody = req.body?.refreshToken;
  const result = await userService.refreshToken(refreshTokenFromCookie || refreshTokenFromBody);

  if (result.accessToken) {
    res.cookie(
      'accessToken',
      result.accessToken,
      getCrossDomainCookieOptions(60 * 60 * 24 * 7)
    );
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

export const getSession = catchAsync(async (req, res) => {
  console.log('========== SESSION CHECK ==========');
  console.log('req.cookies:', JSON.stringify(req.cookies));
  console.log('Headers Cookie:', req.headers.cookie);
  
  // Read from cookies (set by cookie-parser middleware)
  // Must match exact cookie name set in login/register: 'accessToken'
  const token = req.cookies?.accessToken;
  console.log('Extracted token from cookies:', token ? 'PRESENT' : 'MISSING');
  
  if (!token) {
    console.log('No token found in cookies');
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'No session',
      data: { user: null, isAuthenticated: false },
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id?: string; userId?: string; role?: string };
    console.log('Decoded JWT:', decoded);
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      console.log('No user ID in token payload');
      throw new Error('No user ID in token');
    }
    const user = await userService.getUserById(userId);
    console.log('User found:', user?.email);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Session active',
      data: { user, isAuthenticated: true },
    });
  } catch (error) {
    console.log('JWT verification failed:', error);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Invalid session',
      data: { user: null, isAuthenticated: false },
    });
  }
});

export const logout = catchAsync(async (req, res) => {
  const clearOptions = getCrossDomainCookieOptions(0);
  res.clearCookie('accessToken', clearOptions);
  res.clearCookie('refreshToken', clearOptions);

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

export const changePassword = catchAsync(async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Current password and new password are required',
      data: null,
    });
  }

  if (newPassword.length < 8) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'New password must be at least 8 characters',
      data: null,
    });
  }

  const result = await userService.changePassword(req.user!.id, currentPassword, newPassword);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});
