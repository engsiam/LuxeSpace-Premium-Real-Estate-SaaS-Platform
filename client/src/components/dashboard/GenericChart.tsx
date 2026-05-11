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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  name: string;
  value1: number;
  value2: number;
}

interface GenericChartProps {
  data: ChartData[];
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
}

const defaultChartConfig: ChartConfig = {
  value1: { label: '', color: '#c9a74d' },
  value2: { label: '', color: '#22c55e' },
};

const fallbackData = [
  { name: 'Jan', value1: 200, value2: 120 },
  { name: 'Feb', value1: 500, value2: 240 },
  { name: 'Mar', value1: 300, value2: 380 },
  { name: 'Apr', value1: 600, value2: 450 },
  { name: 'May', value1: 400, value2: 300 },
  { name: 'Jun', value1: 800, value2: 500 },
];

export function GenericChart({ 
  data, 
  label1, 
  label2, 
  color1 = '#c9a74d', 
  color2 = '#22c55e'
}: GenericChartProps) {
  const chartConfig: ChartConfig = {
    value1: { label: label1, color: color1 },
    value2: { label: label2, color: color2 },
  };

  const chartData = data.length > 0 && data.some(d => d.value1 > 0 || d.value2 > 0) ? data : fallbackData;
  const hasRealData = data.length > 0 && data.some(d => d.value1 > 0 || d.value2 > 0);

  return (
    <div className="relative">
      <ChartContainer config={chartConfig} className="h-[250px] lg:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient1-${label1.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color1} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color1} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`gradient2-${label2.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color2} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis 
              dataKey="name" 
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
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <ChartLegend 
              content={<ChartLegendContent />} 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Area
              type="monotone"
              dataKey="value1"
              stroke={color1}
              strokeWidth={3}
              fill={`url(#gradient1-${label1.replace(/\s/g, '')})`}
              dot={{ r: 5, fill: color1, strokeWidth: 2, stroke: "#1e1e2e" }}
              activeDot={{ r: 7, fill: color1 }}
              name={label1}
            />
            <Area
              type="monotone"
              dataKey="value2"
              stroke={color2}
              strokeWidth={3}
              fill={`url(#gradient2-${label2.replace(/\s/g, '')})`}
              dot={{ r: 5, fill: color2, strokeWidth: 2, stroke: "#1e1e2e" }}
              activeDot={{ r: 7, fill: color2 }}
              name={label2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {!hasRealData && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 pointer-events-none">
          <div className="text-center">
            <TrendingUp className="w-10 h-10 text-primary/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No data yet</p>
            <p className="text-muted-foreground/50 text-xs mt-1">Showing sample data</p>
          </div>
        </div>
      )}
    </div>
  );
}