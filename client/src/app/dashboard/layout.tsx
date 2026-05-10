'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import DashboardHeader from '@/components/shared/DashboardHeader';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/session`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.data?.isAuthenticated) {
          setUser(response.data.data.user);
        } else {
          window.location.href = '/login';
        }
      } catch {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
    } catch {}
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={user.role || 'USER'} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
