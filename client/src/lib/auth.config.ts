import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { user, accessToken, refreshToken } = response.data.data;

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken,
              refreshToken,
            };
          }
          return null;
        } catch (error: any) {
          console.error('Authorize error:', error?.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const response = await axios.post(`${BASE_URL}/auth/google`, {
            email: user.email,
            name: user.name,
            avatar: user.image,
            role: 'USER',
          });

          if (response.data.success) {
            const backendData = response.data.data;
            // Attach backend credentials to the NextAuth user object
            user.accessToken = backendData.accessToken;
            user.refreshToken = backendData.refreshToken;
            user.role = backendData.user.role;
            user.id = backendData.user.id;
            return true;
          }
          return false;
        } catch (error) {
          console.error('Google Auth Sync Error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
