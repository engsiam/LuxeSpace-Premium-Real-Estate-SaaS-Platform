'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import LenisProvider from '@/components/shared/LenisProvider';
import { Toaster } from 'sonner';
import ThemeInitializer from '@/components/shared/ThemeInitializer';
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
    <TooltipProvider>
      <LenisProvider>
        <ThemeInitializer />
        <PWAProvider>
          {children}
          <AIChatSidebar />
          <ScrollToTop />
        </PWAProvider>
      </LenisProvider>
      <Toaster richColors position="top-right" />
    </TooltipProvider>
  );
}
