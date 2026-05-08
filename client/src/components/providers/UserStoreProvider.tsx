'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrating, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hydrateTimeout, setHydrateTimeout] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrate();
    
    const timer = setTimeout(() => {
      setHydrateTimeout(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [hydrate]);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrating, router, pathname, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}