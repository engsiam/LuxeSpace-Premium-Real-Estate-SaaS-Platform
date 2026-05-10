'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      hydrate();
    }
  }, [mounted, user, hydrate]);

  if (!mounted) {
    return <FullScreenLoading message="Loading" subMessage="Initializing..." />;
  }

  return <>{children}</>;
}
