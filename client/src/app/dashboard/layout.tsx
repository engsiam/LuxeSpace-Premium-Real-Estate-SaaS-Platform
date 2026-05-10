'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useIsHydrated } from '@/store/useAuthStore';

import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useUser();
  const hydrated = useIsHydrated();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hydrated) return;

    // only redirect if auth fully checked and no user
    if (user === null) {
      router.replace('/login');
    }
  }, [mounted, hydrated, user, router]);

  // prevent hydration mismatch
  if (!mounted || !hydrated) {
    return (
      <FullScreenLoading
        message="Loading"
        subMessage="Preparing dashboard..."
      />
    );
  }

  // while redirecting
  if (!user) {
    return (
      <FullScreenLoading
        message="Redirecting"
        subMessage="Going to login page..."
      />
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