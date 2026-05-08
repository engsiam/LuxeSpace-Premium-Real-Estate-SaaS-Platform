import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SERVER_URL: z.string().optional(),
  CLIENT_URL: z.string().optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  BKASH_BASE_URL: z.string().optional(),
  BKASH_APP_KEY: z.string().optional(),
  BKASH_APP_SECRET: z.string().optional(),
  BKASH_USERNAME: z.string().optional(),
  BKASH_PASSWORD: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

const env = envSchema.parse(process.env);

export function getClientUrl(): string {
  if (!env.CLIENT_URL) {
    throw new Error('CLIENT_URL environment variable is required');
  }
  return env.CLIENT_URL;
}

export function getServerUrl(): string {
  if (!env.SERVER_URL) {
    throw new Error('SERVER_URL environment variable is required');
  }
  return env.SERVER_URL;
}

export function getTrustedOrigins(): string[] {
  if (!env.TRUSTED_ORIGINS) {
    throw new Error('TRUSTED_ORIGINS environment variable is required');
  }
  return env.TRUSTED_ORIGINS.split(',').map(o => o.trim());
}

export default env;
