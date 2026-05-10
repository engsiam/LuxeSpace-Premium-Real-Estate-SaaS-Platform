'use client';

import TransactionHistory from '@/components/dashboard/TransactionHistory';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminTransactions() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-8 mb-8 lg:mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Global Revenue</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white leading-none">
              Financial <span className="text-primary italic">Audit</span>
            </h1>
          </div>
          
          <div className="flex gap-3 lg:gap-4 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl lg:min-w-[160px] lg:min-w-[200px] flex-1">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Total Volume</p>
              <h3 className="text-lg lg:text-2xl font-black text-white">৳4.2M</h3>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-4 lg:p-6 rounded-2xl lg:min-w-[160px] lg:min-w-[200px] flex-1">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Success Rate</p>
              <h3 className="text-lg lg:text-2xl font-black text-white">94.2%</h3>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-16">
          {[
            { label: 'Settled', value: '৳3.8M', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Pending', value: '৳240K', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Failed', value: '৳12K', icon: BarChart3, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all"
            >
              <div>
                <p className="text-[10px] lg:text-[10px] text-white/40 font-black uppercase tracking-widest mb-1 lg:mb-2">{stat.label}</p>
                <h3 className="text-xl lg:text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`w-10 lg:w-14 h-10 lg:h-14 rounded-xl lg:rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} className="lg:w-7 lg:h-7" />
              </div>
            </motion.div>
          ))}
        </div>

        <TransactionHistory />
      </div>
    </div>
  );
}