'use client';

import { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Calendar, Heart, DollarSign, Building2, ArrowUpRight } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useWishlistItems } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
  const { items: wishlistItems, hasHydrated: wishlistHydrated } = useWishlistItems();

  console.log('[UserDashboard] Render - wishlistHydrated:', wishlistHydrated);

  useEffect(() => {
    if (!wishlistHydrated) return;

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
          wishlistCount: wishlistItems.length,
          totalSpent,
          activeBookings,
        });
      } catch {
        setStats((prev) => ({ ...prev, wishlistCount: wishlistItems.length }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [wishlistHydrated, wishlistItems.length]);

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-10 border-b border-border flex justify-between items-center bg-background/20">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Personal Growth</h2>
            <p className="text-sm text-muted-foreground font-medium">Monthly spending and booking frequency</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Investment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bookings</span>
            </div>
          </div>
        </div>
        <div className="p-10">
          <GenericChart 
            data={[
              { name: 'Jan', value1: 200, value2: 120 },
              { name: 'Feb', value1: 500, value2: 240 },
              { name: 'Mar', value1: 300, value2: 380 },
              { name: 'Apr', value1: 600, value2: 450 },
              { name: 'May', value1: 400, value2: 300 },
              { name: 'Jun', value1: 800, value2: 500 },
              { name: 'Jul', value1: 700, value2: 550 },
            ]} 
            label1="Investment" 
            label2="Bookings" 
          />
        </div>
      </motion.div>
    </div>
  );
}

function GenericChart({ data, label1, label2 }: { data: { name: string; value1: number; value2: number }[]; label1: string; label2: string }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.value1, d.value2)));
  
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2 h-48">
        {data.map((item, i) => (
          <div key={item.name} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end h-40">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value1 / maxValue) * 100}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-primary/60 rounded-t-lg"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value2 / maxValue) * 100}%` }}
                transition={{ delay: i * 0.1 + 0.05 }}
                className="flex-1 bg-secondary/60 rounded-t-lg"
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs font-bold text-muted-foreground">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-xs font-bold text-muted-foreground">{label2}</span>
        </div>
      </div>
    </div>
  );
}
