'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, useIsHydrated } from '@/store/useAuthStore';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}