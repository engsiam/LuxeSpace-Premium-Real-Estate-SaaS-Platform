'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

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
  height = 300 
}: GenericChartProps) {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => Math.max(d.value1, d.value2)));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2 h-48">
        {data.map((item, i) => (
          <div key={item.name} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end h-40">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((item.value1 / maxValue) * 100, 2)}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 bg-primary/60 rounded-t-lg"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((item.value2 / maxValue) * 100, 2)}%` }}
                transition={{ delay: i * 0.1 + 0.05, duration: 0.5 }}
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
