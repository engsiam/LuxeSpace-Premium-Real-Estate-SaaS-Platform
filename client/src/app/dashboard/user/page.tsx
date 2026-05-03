'use client';

import { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Calendar, Heart, DollarSign, Building2, ArrowUpRight } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface UserStats {
  totalBookings: number;
  wishlistCount: number;
  totalSpent: number;
  activeBookings: number;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    wishlistCount: 0,
    totalSpent: 0,
    activeBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const { items } = useWishlistStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/bookings');
        const bookings = response.data.data || [];

        const totalBookings = bookings.length;
        const activeBookings = bookings.filter((b: any) => b.status === 'PENDING' || b.status === 'CONFIRMED').length;
        const totalSpent = bookings
          .filter((b: any) => b.status === 'PAID')
          .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

        setStats({
          totalBookings,
          wishlistCount: items.length,
          totalSpent,
          activeBookings,
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [items.length]);

  if (loading) {
    return (
      <div className="p-10 space-y-10 bg-background min-h-screen">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-card animate-pulse rounded-xl" />
          <div className="h-4 w-48 bg-card animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">User Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Dashboard</span></h1>
        </div>

        <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground">
          <ArrowUpRight size={18} className="mr-2" />
          View Profile
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} trend="+12% from last month" index={0} />
        <OverviewCard title="Wishlist" value={stats.wishlistCount} icon={Heart} trend="+3 new items" index={1} />
        <OverviewCard title="Total Spent" value={`৳${stats.totalSpent.toLocaleString()}`} icon={DollarSign} trend="+24% from last month" index={2} />
        <OverviewCard title="Active Bookings" value={stats.activeBookings} icon={Building2} trend="Action required" index={3} />
      </div>
    </div>
  );
}
