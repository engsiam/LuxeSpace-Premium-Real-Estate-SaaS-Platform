import { createAuthClient } from 'better-auth/react';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/auth`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
  }
  return `${appUrl}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  fetchOptions: {
    credentials: 'include',
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;