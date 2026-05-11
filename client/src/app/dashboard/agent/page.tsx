'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { Building2, Eye, MessageSquare, TrendingUp, Plus, X, Star } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { GenericChart } from '@/components/dashboard/GenericChart';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AgentGrowthData {
  name: string;
  value1: number;
  value2: number;
}

export default function AgentDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    totalReviews: 0,
    avgRating: 0,
  });
  const [growthData, setGrowthData] = useState<AgentGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEngagementFullscreen, setShowEngagementFullscreen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/properties/agent-stats');
        console.log('Agent stats response:', response.data.data);
        const data = response.data.data;
        
        setStats({
          totalProperties: data.totalProperties || 0,
          totalViews: data.totalViews || 0,
          totalInquiries: data.totalInquiries || 0,
          totalRevenue: data.totalRevenue || 0,
          totalReviews: data.totalReviews || 0,
          avgRating: data.avgRating || 0,
        });

        setGrowthData(data.engagementData || []);
      } catch (error: any) {
        console.error('Failed to fetch stats:', error.response?.data || error.message);
        toast.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-10 bg-background min-h-screen">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 md:h-10 md:w-64 bg-card animate-pulse rounded-xl lg:rounded-2xl" />
          <div className="h-3 w-32 md:h-4 md:w-48 bg-card animate-pulse rounded-xl lg:rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 md:h-36 lg:h-40 bg-card animate-pulse rounded-xl lg:rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-12 bg-background min-h-screen">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
        <OverviewCard title="My Properties" value={stats.totalProperties} icon={Building2} trend="+12% from last month" index={0} />
        <OverviewCard title="Total Views" value={stats.totalViews} icon={Eye} trend="+5% from last month" index={1} />
        <OverviewCard title="Inquiries" value={stats.totalInquiries} icon={MessageSquare} trend="+3 new" index={2} />
        <OverviewCard title="Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="+24% from last month" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-4 md:p-6 lg:p-10 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/20">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">Property Engagement</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Monthly views and inquiries performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inquiries</span>
            </div>
            <Button variant="outline" onClick={() => setShowEngagementFullscreen(true)} className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-secondary-foreground text-xs h-10 ml-2">
              View Report
            </Button>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-10">
          <GenericChart 
            data={growthData.length > 0 ? growthData : []} 
            label1="Views" 
            label2="Inquiries"
            color1="#c9a74d"
            color2="#22c55e"
          />
        </div>
      </motion.div>

      {/* Full Screen Engagement Dialog */}
      <Dialog open={showEngagementFullscreen} onOpenChange={setShowEngagementFullscreen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full bg-card border-border p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white">Property Engagement</h2>
                <p className="text-sm text-muted-foreground">Monthly views and inquiries performance</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEngagementFullscreen(false)} className="rounded-xl">
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 p-6 lg:p-10">
              <div className="h-full min-h-[500px]">
                <GenericChart 
                  data={growthData.length > 0 ? growthData : []} 
                  label1="Views" 
                  label2="Inquiries"
                  color1="#c9a74d"
                  color2="#22c55e"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-4">
              <Link href="/dashboard/agent/my-properties" onClick={() => setShowEngagementFullscreen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 font-bold">My Properties</Button>
              </Link>
              <Link href="/dashboard/agent/add-property" onClick={() => setShowEngagementFullscreen(false)} className="flex-1">
                <Button className="w-full rounded-xl h-12 font-bold bg-primary">Add Property</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
