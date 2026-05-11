'use client';

import { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Calendar, Heart, DollarSign, Building2, ArrowUpRight, X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useWishlistItems } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GenericChart } from '@/components/dashboard/GenericChart';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface UserStats {
  totalBookings: number;
  wishlistCount: number;
  totalSpent: number;
  activeBookings: number;
}

interface GrowthData {
  name: string;
  value1: number;
  value2: number;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    wishlistCount: 0,
    totalSpent: 0,
    activeBookings: 0,
  });
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGrowthFullscreen, setShowGrowthFullscreen] = useState(false);
  const { items: wishlistItems, hasHydrated: wishlistHydrated } = useWishlistItems();

  useEffect(() => {
    if (!wishlistHydrated) return;

    const fetchStats = async () => {
      try {
        const [bookingsRes, growthRes] = await Promise.all([
          axiosInstance.get('/bookings'),
          axiosInstance.get('/bookings/growth').catch(() => ({ data: { data: [] } })),
        ]);
        const bookings = bookingsRes.data.data || [];
        const growthData = growthRes.data.data || [];

        const totalBookings = bookings.length;
        const activeBookings = bookings.filter((b: any) => b.status === 'PENDING').length;
        const totalSpent = bookings
          .filter((b: any) => b.status === 'PAID')
          .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

        setStats({
          totalBookings,
          wishlistCount: wishlistItems.length,
          totalSpent,
          activeBookings,
        });

        if (growthData.length > 0) {
          setGrowthData(growthData);
        }
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
      <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-10 bg-background min-h-screen">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 md:h-10 md:w-64 bg-card animate-pulse rounded-xl" />
          <div className="h-4 w-32 md:w-48 bg-card animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 md:h-36 lg:h-40 bg-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs">User Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Dashboard</span></h1>
        </div>

        <Link href="/dashboard/user/profile">
          <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground text-xs md:text-sm px-4 py-2 md:px-6">
            View Profile
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
        <OverviewCard title="Bookings" value={stats.totalBookings} icon={Calendar} trend="+12%" index={0} />
        <OverviewCard title="Wishlist" value={stats.wishlistCount} icon={Heart} trend="+3 new" index={1} />
        <OverviewCard title="Spent" value={`৳${stats.totalSpent.toLocaleString()}`} icon={DollarSign} trend="+24%" index={2} />
        <OverviewCard title="Active" value={stats.activeBookings} icon={Building2} trend="Action" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border shadow-2xl rounded-2xl lg:rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-4 md:p-6 lg:p-10 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/20">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">Personal Growth</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium hidden sm:block">Monthly spending and booking frequency</p>
          </div>
          <div className="flex gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-primary" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Spending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-secondary" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bookings</span>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-10 flex justify-end">
          <Button variant="outline" onClick={() => setShowGrowthFullscreen(true)} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground text-xs h-10">
            View Report
          </Button>
        </div>
        <div className="p-4 md:p-6 lg:p-10">
          <GenericChart 
            data={growthData.length > 0 ? growthData : []} 
            label1="Spending (৳)" 
            label2="Bookings"
            color1="#c9a74d"
            color2="#22c55e"
          />
        </div>
      </motion.div>

      {/* Full Screen Growth Dialog */}
      <Dialog open={showGrowthFullscreen} onOpenChange={setShowGrowthFullscreen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full bg-card border-border p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white">Personal Growth</h2>
                <p className="text-sm text-muted-foreground">Monthly spending and booking frequency</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowGrowthFullscreen(false)} className="rounded-xl">
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 p-6 lg:p-10">
              <div className="h-full min-h-[500px]">
                <GenericChart 
                  data={growthData.length > 0 ? growthData : []} 
                  label1="Spending (৳)" 
                  label2="Bookings"
                  color1="#c9a74d"
                  color2="#22c55e"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-4">
              <Link href="/dashboard/user/wishlist" onClick={() => setShowGrowthFullscreen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 font-bold">My Wishlist</Button>
              </Link>
              <Link href="/dashboard/user/my-bookings" onClick={() => setShowGrowthFullscreen(false)} className="flex-1">
                <Button className="w-full rounded-xl h-12 font-bold bg-primary">My Bookings</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}