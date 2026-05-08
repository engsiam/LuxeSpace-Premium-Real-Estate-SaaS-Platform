import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '../prisma/client';
import env, { getServerUrl, getTrustedOrigins } from '../config';

const getGoogleRedirectUri = (): string => {
  const serverUrl = env.SERVER_URL || process.env.SERVER_URL;
  if (!serverUrl) {
    throw new Error('SERVER_URL is required for Google OAuth');
  }
  return `${serverUrl}/api/v1/auth/callback/google`;
};

const isProduction = env.NODE_ENV === 'production';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectURI: getGoogleRedirectUri(),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  trustedOrigins: getTrustedOrigins(),
  cookies: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;