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
  height?: number;
}

export function GenericChart({ 
  data, 
  label1, 
  label2, 
  color1 = 'hsl(var(--primary))', 
  color2 = 'hsl(var(--secondary))',
  height = 300 
}: GenericChartProps) {
  const chartConfig: ChartConfig = {
    value1: { label: label1, color: color1 },
    value2: { label: label2, color: color2 },
  };

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color1} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color2} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color2} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            style={{ fontSize: '10px', fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            style={{ fontSize: '10px', fontWeight: 'bold', fill: 'currentColor', opacity: 0.5 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="value1"
            stroke={color1}
            fillOpacity={1}
            fill="url(#color1)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="value2"
            stroke={color2}
            fillOpacity={1}
            fill="url(#color2)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
