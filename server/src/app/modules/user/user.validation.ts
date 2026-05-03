import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'AGENT', 'ADMIN']).default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(['USER', 'AGENT', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export const googleAuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name is required'),
  avatar: z.string().url().optional(),
  role: z.enum(['USER', 'AGENT', 'ADMIN']).optional().default('USER'),
});
