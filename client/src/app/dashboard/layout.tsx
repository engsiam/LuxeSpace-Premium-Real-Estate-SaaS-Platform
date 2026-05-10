'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useIsHydrated } from '@/store/useAuthStore';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUser();
  const isHydrated = useIsHydrated();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      setReady(true);
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login');
    }
  }, [ready, user]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={user.role || 'USER'} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
