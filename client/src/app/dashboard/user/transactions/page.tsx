'use client';

import TransactionHistory from '@/components/dashboard/TransactionHistory';
import { motion } from 'framer-motion';

export default function UserTransactions() {
  return (
    <div className="p-8 space-y-12 bg-background min-h-screen">
      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Financial Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
            Transaction <span className="text-primary italic">Ledger</span>
          </h1>
        </motion.div>

        <TransactionHistory />
      </div>
    </div>
  );
}
