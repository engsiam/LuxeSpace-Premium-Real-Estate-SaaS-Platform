'use client';

import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import LenisProvider from '@/components/shared/LenisProvider';
import { Toaster } from 'sonner';
import ThemeInitializer from '@/components/shared/ThemeInitializer';
import AIChatSidebar from '@/components/shared/AIChatSidebar';
import { UserStoreProvider } from '@/components/providers/UserStoreProvider';
import PWAProvider from '@/components/shared/PWAProvider';

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
            </UserStoreProvider>
          </PWAProvider>
        </LenisProvider>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </SessionProvider>
  );
}