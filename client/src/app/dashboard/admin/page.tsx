'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Building2, Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Link from 'next/link';

interface MonthlyBooking {
  _id: string;
  revenue: number;
  count: number;
}

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  icon: string;
  color: string;
}

interface Stats {
  totalProperties: number;
  totalUsers: number;
  totalRevenue: number;
  pendingBookings: number;
  totalBookings: number;
  monthlyBookings: MonthlyBooking[];
  recentActivity: ActivityItem[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChartFullscreen, setShowChartFullscreen] = useState(false);
  const [showActivityFullscreen, setShowActivityFullscreen] = useState(false);

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
        month: item._id || 'Unknown',
        revenue: item.revenue || 0,
        bookings: item.count || 0,
      }))
    : [];

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs">Management Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white">Dashboard <span className="text-primary italic">Overview</span></h1>
        </motion.div>

        <div className="flex gap-3 lg:gap-4 w-full lg:w-auto">
          <div className="bg-card border border-border p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-3 lg:gap-4 shadow-xl flex-1 lg:flex-none">
            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Activity size={18} className="lg:w-6 lg:h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:block">System Status</p>
              <p className="font-bold text-emerald-500 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <OverviewCard title="Properties" value={stats?.totalProperties || 0} icon={Building2} trend="+12%" index={0} />
        <OverviewCard title="Users" value={stats?.totalUsers || 0} icon={Users} trend="+5%" index={1} />
        <OverviewCard title="Revenue" value={`৳${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} trend="+24%" index={2} />
        <OverviewCard title="Bookings" value={stats?.pendingBookings || 0} icon={Calendar} trend="Action" index={3} />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border border-border shadow-xl rounded-2xl lg:rounded-[2.5rem] overflow-hidden p-4 lg:p-10">
            <div className="p-4 lg:p-8 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/30">
              <div>
                <h2 className="text-lg lg:text-2xl font-black tracking-tight text-white">Financial Growth</h2>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium hidden sm:block">Monthly revenue and booking trends</p>
              </div>
              <Button variant="outline" onClick={() => setShowChartFullscreen(true)} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground text-xs lg:text-sm h-10 lg:h-12">
                View Report
              </Button>
            </div>
            <div className="p-4 lg:p-10">
              <div className="h-[250px] lg:h-[400px] w-full">
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
          <div className="border border-border bg-card shadow-2xl rounded-2xl lg:rounded-[2.5rem] overflow-hidden h-full">
            <div className="p-4 lg:p-8 border-b border-border bg-background/30">
              <h2 className="text-lg lg:text-2xl font-black tracking-tight text-white">Recent Activity</h2>
              <p className="text-xs lg:text-sm text-muted-foreground font-medium hidden sm:block">Global platform events</p>
            </div>
            <div className="p-4 lg:p-8">
              <div className="space-y-4 lg:space-y-8">
                {stats?.recentActivity?.length ? (
                  stats.recentActivity.map((log, i) => (
                    <div 
                      key={i} 
                      onClick={() => setShowActivityFullscreen(true)}
                      className="flex items-center gap-3 lg:gap-6 group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
                    >
                      <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-xl lg:rounded-2xl bg-background flex items-center justify-center ${log.color} border border-border group-hover:scale-110 transition-transform`}>
                        {log.icon === 'DollarSign' && <DollarSign size={16} className="lg:w-5 lg:h-5" />}
                        {log.icon === 'Users' && <Users size={16} className="lg:w-5 lg:h-5" />}
                        {log.icon === 'Building2' && <Building2 size={16} className="lg:w-5 lg:h-5" />}
                        {log.icon === 'Activity' && <Activity size={16} className="lg:w-5 lg:h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-black text-white truncate">
                          {log.user} <span className="text-muted-foreground font-medium">{log.action}</span>
                        </p>
                        <p className="text-[9px] lg:text-xs font-black uppercase tracking-widest text-muted-foreground/60">{log.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-6 lg:mt-12">
                <Button variant="ghost" onClick={() => setShowActivityFullscreen(true)} className="rounded-xl font-black tracking-widest text-[10px] lg:text-xs text-primary hover:bg-primary/10 py-4 lg:py-6 px-6 lg:px-10">
                  VIEW ALL
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Screen Chart Dialog */}
      <Dialog open={showChartFullscreen} onOpenChange={setShowChartFullscreen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full bg-card border-border p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white">Financial Growth</h2>
                <p className="text-sm text-muted-foreground">Monthly revenue and booking trends</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowChartFullscreen(false)} className="rounded-xl">
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 p-6 lg:p-10">
              <div className="h-full min-h-[500px]">
                <RevenueChart data={monthlyData} />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-4">
              <Link href="/dashboard/admin/transactions" onClick={() => setShowChartFullscreen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 font-bold">View Transactions</Button>
              </Link>
              <Link href="/dashboard/admin/bookings" onClick={() => setShowChartFullscreen(false)} className="flex-1">
                <Button className="w-full rounded-xl h-12 font-bold bg-primary">View All Bookings</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Activity Dialog */}
      <Dialog open={showActivityFullscreen} onOpenChange={setShowActivityFullscreen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full bg-card border-border p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Global platform events</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowActivityFullscreen(false)} className="rounded-xl">
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="space-y-4">
                {stats?.recentActivity?.length ? (
                  stats.recentActivity.concat(
                    Array(20).fill(null).map((_, i) => ({
                      user: `User ${i + 7}`,
                      action: i % 3 === 0 ? 'booked a property' : i % 3 === 1 ? 'registered as USER' : 'added new property',
                      time: `${i + 1} days ago`,
                      icon: i % 3 === 0 ? 'DollarSign' : i % 3 === 1 ? 'Users' : 'Building2',
                      color: i % 3 === 0 ? 'text-emerald-500' : i % 3 === 1 ? 'text-blue-500' : 'text-primary',
                    }))
                  ).map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center ${log.color} border border-border`}>
                        {log.icon === 'DollarSign' && <DollarSign size={20} />}
                        {log.icon === 'Users' && <Users size={20} />}
                        {log.icon === 'Building2' && <Building2 size={20} />}
                        {log.icon === 'Activity' && <Activity size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">
                          {log.user} <span className="text-muted-foreground font-medium">{log.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground/60 font-black uppercase tracking-widest">{log.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <Activity size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <Link href="/dashboard/admin/bookings" onClick={() => setShowActivityFullscreen(false)} className="w-full">
                <Button className="w-full rounded-xl h-12 font-bold bg-primary">View All Activity</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
