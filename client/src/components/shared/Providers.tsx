'use client';

import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import LenisProvider from '@/components/shared/LenisProvider';
import { Toaster } from 'sonner';
import ThemeInitializer from '@/components/shared/ThemeInitializer';
import { UserStoreProvider } from '@/components/providers/UserStoreProvider';
import PWAProvider from '@/components/shared/PWAProvider';
import dynamic from 'next/dynamic';

const AIChatSidebar = dynamic(() => import('@/components/shared/AIChatSidebar'), {
  ssr: false,
  loading: () => null,
});

const ScrollToTop = dynamic(() => import('@/components/shared/ScrollToTop'), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <LenisProvider>
          <ThemeInitializer />
          <PWAProvider>
            <UserStoreProvider>
              {children}
              <AIChatSidebar />
              <ScrollToTop />
            </UserStoreProvider>
          </PWAProvider>
        </LenisProvider>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </SessionProvider>
  );
}