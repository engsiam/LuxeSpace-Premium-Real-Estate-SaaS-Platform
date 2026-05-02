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
} from 'recharts';

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
}

const chartConfig: ChartConfig = {
  revenue: { label: 'Revenue (BDT)', color: 'hsl(var(--primary))' },
  bookings: { label: 'Bookings', color: 'hsl(var(--secondary))' },
};

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--secondary))" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
