'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useIsHydrated } from '@/store/useAuthStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useUser();
  const hydrated = useIsHydrated();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hydrated) return;

    console.log('[Dashboard Auth]', {
      mounted,
      hydrated,
      hasUser: !!user,
      pathname,
    });

    if (!user) {
      router.replace('/login');
    }
  }, [mounted, hydrated, user, pathname, router]);

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}