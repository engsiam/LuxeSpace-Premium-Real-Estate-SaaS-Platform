'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useIsHydrated } from '@/store/useAuthStore';
import FullScreenLoading from '@/components/shared/FullScreenLoading';

export default function DashboardPage() {
  const router = useRouter();
  const user = useUser();
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const role = user.role?.toLowerCase() || 'user';
    router.replace(`/dashboard/${role}`);
  }, [isHydrated, user, router]);

  return <FullScreenLoading message="Redirecting" subMessage="Loading your dashboard..." />;
}
