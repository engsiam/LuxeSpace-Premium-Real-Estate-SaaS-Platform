'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isHydrating } = useAuthStore();

  useEffect(() => {
    // Wait for hydration to complete
    if (isHydrating) return;

    // If no user, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // Determine role and redirect
    const role = user.role?.toLowerCase() || 'user';
    router.replace(`/dashboard/${role}`);
  }, [isHydrating, user, router]);

  // Don't block rendering - just show loading while hydrating
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}