'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

let SidebarComponent: React.ComponentType<{ role: string }> | null = null;
let HeaderComponent: React.ComponentType<object> | null = null;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [ready, setReady] = useState(false);
  const [sidebar, setSidebar] = useState<React.ComponentType<{ role: string }> | null>(null);
  const [header, setHeader] = useState<React.ComponentType<object> | null>(null);

  useEffect(() => {
    if (isHydrated) {
      setReady(true);
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Lazy load sidebar to prevent SSR issues
    if (!sidebar) {
      import('@/components/shared/DashboardSidebar').then((mod) => {
        setSidebar(() => mod.default);
      });
    }

    // Lazy load header
    if (!header) {
      import('@/components/shared/DashboardHeader').then((mod) => {
        setHeader(() => mod.default);
      });
    }
  }, [ready, user, sidebar, header]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  const Sidebar = sidebar;
  const Header = header;

  return (
    <div className="flex min-h-screen bg-background">
      {Sidebar ? <Sidebar role={user.role || 'USER'} /> : (
        <div className="w-80 bg-card border-r border-border h-screen flex items-center justify-center">
          <div className="text-primary animate-pulse">Loading...</div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-screen">
        {Header ? <Header /> : (
          <div className="h-16 border-b border-border flex items-center px-6">
            <div className="text-muted-foreground animate-pulse">Loading...</div>
          </div>
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
