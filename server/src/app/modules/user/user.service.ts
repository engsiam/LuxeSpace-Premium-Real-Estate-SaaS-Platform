import prisma from '../../../prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import env from '../../../config';
import ApiError from '../../utils/ApiError';
import { Role } from '@prisma/client';

export interface IUpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: Role;
  isActive?: boolean;
}

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: (data.role as Role) || 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
  });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET as Secret,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET as Secret,
    { expiresIn: '30d' } as SignOptions
  );

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET as Secret,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET as Secret,
    { expiresIn: '30d' } as SignOptions
  );

  // Return tokens in response for frontend to store if needed (deprecated - use cookies)
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const googleAuth = async (data: { email: string; name: string; avatar?: string; role?: string }) => {
  let user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        avatar: data.avatar,
        role: (data.role as Role) || 'USER',
      },
    });
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET as Secret,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.JWT_REFRESH_SECRET as Secret,
    { expiresIn: '30d' } as SignOptions
  );

  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET as Secret,
      { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
    );

    return { accessToken };
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
};

export const getUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const updateUser = async (id: string, data: IUpdateUserData) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.password) {
    throw new ApiError(400, 'No password set for this account');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
};
