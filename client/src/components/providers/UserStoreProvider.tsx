'use client';

import { useEffect, useState, useRef, createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
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
  const { hydrate, isHydrating, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hydratedRef.current) return;
    
    hydratedRef.current = true;
    hydrate();
  }, [mounted, hydrate]);

  useEffect(() => {
    if (!mounted || isHydrating) return;
    
    if (!isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrating, router, pathname, mounted]);

  const isAuthReady = mounted && !isHydrating;

  return (
    <AuthLoadingContext.Provider value={{ isHydrating, isAuthReady }}>
      {!mounted ? <AuthLoadingScreen /> : children}
    </AuthLoadingContext.Provider>
  );
}