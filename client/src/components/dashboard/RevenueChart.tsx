'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
}

const chartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: '#c9a74d' },
  bookings: { label: 'Bookings', color: '#22c55e' },
};

const fallbackData = [
  { month: 'Jan', revenue: 45000, bookings: 3 },
  { month: 'Feb', revenue: 52000, bookings: 5 },
  { month: 'Mar', revenue: 38000, bookings: 2 },
  { month: 'Apr', revenue: 65000, bookings: 7 },
  { month: 'May', revenue: 48000, bookings: 4 },
  { month: 'Jun', revenue: 72000, bookings: 8 },
];

export function RevenueChart({ data }: { data: ChartData[] }) {
  const chartData = data.length > 0 && data.some(d => d.revenue > 0 || d.bookings > 0) ? data : fallbackData;

  return (
    <div className="relative">
      <ChartContainer config={chartConfig} className="h-[250px] lg:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a74d" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#c9a74d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickMargin={8}
              tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c9a74d"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ r: 5, fill: "#c9a74d", strokeWidth: 2, stroke: "#1e1e2e" }}
              activeDot={{ r: 7, fill: "#c9a74d" }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#bookingsGradient)"
              dot={{ r: 5, fill: "#22c55e", strokeWidth: 2, stroke: "#1e1e2e" }}
              activeDot={{ r: 7, fill: "#22c55e" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-primary/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No booking data yet</p>
            <p className="text-muted-foreground/50 text-xs mt-1">Showing sample data</p>
          </div>
        </div>
      )}
    </div>
  );
}
