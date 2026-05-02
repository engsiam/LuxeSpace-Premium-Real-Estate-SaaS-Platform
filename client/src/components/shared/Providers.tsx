'use client';

import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import LenisProvider from '@/components/shared/LenisProvider';
import { Toaster } from 'sonner';
import ThemeInitializer from '@/components/shared/ThemeInitializer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <LenisProvider>
          <ThemeInitializer />
          {children}
        </LenisProvider>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </SessionProvider>
  );
}
