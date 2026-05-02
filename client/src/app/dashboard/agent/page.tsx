'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Building2, Eye, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AgentDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/properties?limit=100');
        const properties = response.data.data || [];
        setStats({
          totalProperties: response.data.meta?.total || properties.length || 0,
          totalViews: 0,
          totalInquiries: 0,
          totalRevenue: 0,
        });
      } catch (error) {
        toast.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Agent Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Dashboard</span></h1>
        </motion.div>

        <Link href="/dashboard/agent/add-property">
          <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewCard title="My Properties" value={stats.totalProperties} icon={Building2} trend="+12% from last month" index={0} />
        <OverviewCard title="Total Views" value={stats.totalViews} icon={Eye} trend="+5% from last month" index={1} />
        <OverviewCard title="Inquiries" value={stats.totalInquiries} icon={MessageSquare} trend="+3 new" index={2} />
        <OverviewCard title="Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="+24% from last month" index={3} />
      </div>
    </div>
  );
}
