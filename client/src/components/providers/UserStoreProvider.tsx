'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (initialCheckDone) return;
    if (user) {
      setInitialCheckDone(true);
      return;
    }
    setInitialCheckDone(true);
    hydrate();
  }, [mounted, user, initialCheckDone, hydrate]);

  useEffect(() => {
    if (!mounted || !isHydrated) return;
    const isDashboard = pathname?.startsWith('/dashboard');
    if (isDashboard && !user) {
      window.location.href = '/login';
    }
  }, [mounted, isHydrated, user, pathname]);

  if (!mounted) {
    return <FullScreenLoading message="Loading" subMessage="Initializing..." />;
  }

  return <>{children}</>;
}
