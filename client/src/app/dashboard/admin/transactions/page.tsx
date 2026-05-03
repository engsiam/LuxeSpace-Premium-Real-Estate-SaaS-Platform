'use client';

import TransactionHistory from '@/components/dashboard/TransactionHistory';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function AdminTransactions() {
  return (
    <div className="p-8 space-y-12 bg-background min-h-screen">
      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-0.5 bg-primary rounded-full" />
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Global Revenue</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
              Financial <span className="text-primary italic">Audit</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] min-w-[200px]">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Total Volume</p>
              <h3 className="text-2xl font-black text-white">৳4.2M</h3>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] min-w-[200px]">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Success Rate</p>
              <h3 className="text-2xl font-black text-white">94.2%</h3>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Settled', value: '৳3.8M', icon: DollarSign, color: 'text-emerald-500' },
            { label: 'Pending', value: '৳240K', icon: TrendingUp, color: 'text-amber-500' },
            { label: 'Failed', value: '৳12K', icon: BarChart3, color: 'text-rose-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all"
            >
              <div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
            </motion.div>
          ))}
        </div>

        <TransactionHistory />
      </div>
    </div>
  );
}
