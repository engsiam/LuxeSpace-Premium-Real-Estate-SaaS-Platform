'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Building2, Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MonthlyBooking {
  _id: number;
  revenue: number;
  count: number;
}

interface Stats {
  totalProperties: number;
  totalUsers: number;
  totalRevenue: number;
  pendingBookings: number;
  monthlyBookings: MonthlyBooking[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/stats/overview');
        setStats(response.data.data);
        setError(null);
      } catch (error: any) {
        const errorMsg = 'Failed to fetch dashboard stats';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 space-y-10">
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

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const monthlyData = stats?.monthlyBookings?.length
    ? stats.monthlyBookings.map((item: MonthlyBooking) => ({
        month: `Month ${item._id}`,
        revenue: item.revenue || 0,
        bookings: item.count || 0,
      }))
    : [];

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Management Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Dashboard <span className="text-primary italic">Overview</span></h1>
        </motion.div>

        <div className="flex gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Status</p>
              <p className="font-bold text-emerald-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewCard title="Total Properties" value={stats?.totalProperties || 0} icon={Building2} trend="+12% from last month" index={0} />
        <OverviewCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} trend="+5% from last month" index={1} />
        <OverviewCard title="Total Revenue" value={`৳${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} trend="+24% from last month" index={2} />
        <OverviewCard title="Pending Bookings" value={stats?.pendingBookings || 0} icon={Calendar} trend="Action required" index={3} />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="border border-border bg-card shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-border flex flex-row justify-between items-center bg-background/30">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">Financial Growth</h2>
                <p className="text-sm text-muted-foreground font-medium">Monthly revenue and booking trends</p>
              </div>
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground">
                <ArrowUpRight size={18} className="mr-2" />
                View Detailed Report
              </Button>
            </div>
            <div className="p-10">
              <div className="h-[400px] w-full">
                <RevenueChart data={monthlyData} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="border border-border bg-card shadow-2xl rounded-2xl overflow-hidden h-full">
            <div className="p-8 border-b border-border bg-background/30">
              <h2 className="text-2xl font-black tracking-tight text-white">Recent Activity</h2>
              <p className="text-sm text-muted-foreground font-medium">Global platform events</p>
            </div>
            <div className="p-8">
              <div className="space-y-8">
                {[
                  { user: 'Rahul A.', action: 'booked a Penthouse', time: '2 mins ago', icon: DollarSign, color: 'text-emerald-500' },
                  { user: 'Elite Agent', action: 'added 3 properties', time: '1 hour ago', icon: Building2, color: 'text-primary' },
                  { user: 'Zakir H.', action: 'registered as Agent', time: '3 hours ago', icon: Users, color: 'text-blue-500' },
                  { user: 'System', action: 'backup completed', time: '5 hours ago', icon: Activity, color: 'text-purple-500' }
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className={`w-12 h-12 rounded-2xl bg-background flex items-center justify-center ${log.color} border border-border group-hover:scale-110 transition-transform`}>
                      <log.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-white">
                        {log.user} <span className="text-muted-foreground font-medium">{log.action}</span>
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-12 rounded-xl font-black tracking-widest text-xs text-primary hover:bg-primary/10 py-6">
                VIEW ALL ACTIVITY
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
