'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';

export function SessionProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}