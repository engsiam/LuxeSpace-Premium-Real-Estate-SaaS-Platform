'use client';

import { useEffect, useState, useRef, createContext, useContext, ReactNode } from 'react';
import { useAuthStore, useIsHydrated, useIsAuthenticated } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

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

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
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

  // Skip hydration if already logged in (from login action)
  useEffect(() => {
    if (!mounted) return;
    
    if (user && isAuthenticated) {
      console.log('[UserStoreProvider] Already logged in, skipping hydrate');
      hydrationAttempted.current = true;
      return;
    }
    
    if (hydrationAttempted.current) return;
    hydrationAttempted.current = true;
    
    console.log('[UserStoreProvider] Calling hydrate, user:', !!user);
    hydrate();
  }, [mounted, hydrate, user, isAuthenticated]);

  // Don't redirect from dashboard if user is logged in
  useEffect(() => {
    if (!mounted) return;
    
    const isOnDashboard = pathname?.startsWith('/dashboard');
    const shouldRedirect = !user && isOnDashboard && isHydrated;
    
    if (shouldRedirect) {
      console.log('[UserStoreProvider] No user, redirecting to login');
      router.replace('/login');
    }
  }, [isHydrated, user, router, pathname, mounted]);

  const isAuthReady = mounted && (isHydrated || Boolean(user && isAuthenticated));

  return (
    <AuthLoadingContext.Provider value={{ isHydrating, isAuthReady }}>
      {!mounted ? <AuthLoadingScreen /> : children}
    </AuthLoadingContext.Provider>
  );
}