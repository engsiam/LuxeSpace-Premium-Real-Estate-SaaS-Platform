'use client';

import { useEffect, useState, useRef, createContext, useContext, ReactNode } from 'react';
import { useAuthStore, useIsHydrated, useIsAuthenticated } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

interface AuthLoadingContextType {
  isHydrating: boolean;
  isAuthReady: boolean;
}

const AuthLoadingContext = createContext<AuthLoadingContextType>({
  isHydrating: true,
  isAuthReady: false,
});

export function useAuthLoading() {
  return useContext(AuthLoadingContext);
}

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const { hydrate, isHydrating, user, isAuthenticated } = useAuthStore();
  const isHydrated = useIsHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hydrationAttempted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (user && isAuthenticated) {
      hydrationAttempted.current = true;
      return;
    }
    
    if (hydrationAttempted.current) return;
    hydrationAttempted.current = true;
    
    hydrate();
  }, [mounted, hydrate, user, isAuthenticated]);

  useEffect(() => {
    if (!mounted) return;
    
    const isOnDashboard = pathname?.startsWith('/dashboard');
    const shouldRedirect = !user && isOnDashboard && isHydrated;
    
    if (shouldRedirect) {
      router.replace('/login');
    }
  }, [isHydrated, user, router, pathname, mounted]);

  const isAuthReady = mounted && (isHydrated || Boolean(user && isAuthenticated));

  return (
    <AuthLoadingContext.Provider value={{ isHydrating, isAuthReady }}>
      {!mounted ? <FullScreenLoading message="Loading" subMessage="Initializing app..." /> : children}
    </AuthLoadingContext.Provider>
  );
}
