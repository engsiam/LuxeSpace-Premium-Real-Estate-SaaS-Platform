'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';
import { useUser, useIsHydrated, useIsHydrating } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const isHydrated = useIsHydrated();
  const isHydrating = useIsHydrating();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const redirectChecked = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || redirectChecked.current) return;
    if (isHydrating) return;
    
    if (!user) {
      console.log('[Dashboard] No user after hydration, redirecting to login');
      redirectChecked.current = true;
      router.replace('/login');
    } else {
      console.log('[Dashboard] User found:', user.email, 'role:', user.role);
    }
  }, [mounted, user, isHydrating, router]);

  useEffect(() => {
    if (!user || redirectChecked.current) return;
    
    const role = user.role || 'USER';
    
    if (pathname.includes('/dashboard/admin') && role !== 'ADMIN') {
      redirectChecked.current = true;
      router.replace('/dashboard');
    } else if (pathname.includes('/dashboard/agent') && role !== 'AGENT' && role !== 'ADMIN') {
      redirectChecked.current = true;
      router.replace('/dashboard');
    }
  }, [user, pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-20 lg:w-80 border-r border-border p-4 lg:p-6 space-y-4 bg-card/50">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex-1 p-4 lg:p-6 space-y-6">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const role = user?.role || 'USER';

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
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-50`}>
        <DashboardSidebar role={role} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-card border border-border shadow-lg"
        >
          <Menu size={22} className="text-primary" />
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed top-3 left-[260px] z-50 p-2 rounded-full bg-card border border-border shadow-lg"
        >
          <X size={22} className="text-primary" />
        </button>
      )}

      <main className="flex-1 overflow-y-auto custom-scrollbar relative w-full" data-lenis-prevent>
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