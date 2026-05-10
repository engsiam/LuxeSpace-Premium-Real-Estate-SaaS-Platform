import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  index?: number;
}

export function OverviewCard({ title, value, icon: Icon, trend, index = 0 }: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group border-border bg-card shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl lg:rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-0.5 lg:h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 lg:pb-4 p-4 lg:p-6">
          <CardTitle className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </CardTitle>
          <div className="w-8 lg:w-10 h-8 lg:h-10 bg-secondary rounded-lg lg:rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
            <Icon size={14} className="lg:w-5 lg:h-5" />
          </div>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
          <div className="text-2xl lg:text-4xl font-black tracking-tighter text-foreground mb-1 lg:mb-2">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 lg:gap-2 text-[9px] lg:text-xs font-bold text-muted-foreground">
              <TrendingUp size={10} className="lg:w-3.5 lg:h-3.5 text-green-500" />
              <span>{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}