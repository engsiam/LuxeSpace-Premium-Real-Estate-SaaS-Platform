'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Download, Share2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const trx = searchParams.get('trx');
  const invoice = searchParams.get('invoice');

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-white/5 rounded-[3rem] p-12 text-center shadow-3xl overflow-hidden relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-tight">Reservation <span className="text-primary italic">Confirmed!</span></h1>
          <p className="text-white/60 font-medium text-lg mb-12 max-w-md mx-auto">Your premium asset has been successfully secured. Welcome to the elite circle of LuxeSpace owners.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-white/2 border border-white/5 p-6 rounded-[2rem] text-left">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Transaction ID</p>
              <p className="text-sm font-black text-white tracking-tight">{trx}</p>
            </div>
            <div className="bg-white/2 border border-white/5 p-6 rounded-[2rem] text-left">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Invoice Number</p>
              <p className="text-sm font-black text-white tracking-tight">{invoice?.slice(-12).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/dashboard/user/my-bookings')}
              className="h-16 px-10 bg-primary text-secondary-foreground font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="h-16 px-10 border-white/10 text-white font-black rounded-2xl hover:bg-white/5 transition-all"
            >
              <Download size={18} className="mr-2" />
              Receipt
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={14} className="text-primary/40" />
            Secure Bank-Grade Settlement
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"><CheckCircle2 className="animate-pulse text-emerald-500" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
