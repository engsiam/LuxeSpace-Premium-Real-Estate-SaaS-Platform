'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrating, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      setMounted(true);
      hydrate();
    }
  }, []);

  useEffect(() => {
    if (!mounted || isHydrating) return;
    
    if (!isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrating, router, pathname, mounted]);

  if (!mounted || isHydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}