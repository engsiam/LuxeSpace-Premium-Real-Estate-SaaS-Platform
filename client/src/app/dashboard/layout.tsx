'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';

import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isHydrated) return;

    console.log('Dashboard Layout Render', {
      mounted,
      isHydrated,
      hasUser: !!user,
      role: user?.role,
    });

    if (!user) {
      router.replace('/login');
    }
  }, [mounted, isHydrated, user, router]);

  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={user.role || 'USER'} />

      <div className="flex flex-1 flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}