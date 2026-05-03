'use client';

import { useEffect } from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-80 border-r border-border p-10 space-y-8 bg-card/50">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="flex-1 p-12 space-y-10">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
            <Skeleton className="h-40 w-full rounded-[2.5rem]" />
          </div>
          <Skeleton className="h-[500px] w-full rounded-[3rem]" />
        </div>
      </div>
    );
  }

  const role = session?.user?.role || 'USER';

  // Role-based route protection
  if (pathname.includes('/dashboard/admin') && role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }
  if (pathname.includes('/dashboard/agent') && role !== 'AGENT' && role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <DashboardSidebar role={role} />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative" data-lenis-prevent>
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <DashboardHeader />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
