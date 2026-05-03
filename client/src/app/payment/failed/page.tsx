'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, HelpCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const reason = searchParams.get('reason') || 'Transaction Declined';
  const invoice = searchParams.get('invoice');

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-rose-500/10 rounded-[3rem] p-12 text-center shadow-3xl overflow-hidden relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]" />

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/20"
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter leading-tight">Payment <span className="text-rose-500 italic">Interrupted</span></h1>
          <p className="text-white/60 font-medium text-lg mb-8 max-w-md mx-auto">We encountered an issue while authorizing your transaction. Your assets remain secure, and no funds were deducted.</p>

          <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-[2.5rem] mb-12 flex items-start gap-4 text-left">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="text-rose-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-1">Diagnostic Report</p>
              <p className="text-white font-bold">{reason}</p>
              <p className="text-xs text-white/40 mt-2 font-medium">Reference: {invoice?.slice(-12).toUpperCase()}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.back()}
              className="h-16 px-10 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <RefreshCcw size={18} className="mr-2" />
              Retry Transaction
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/support')}
              className="h-16 px-10 border-white/10 text-white font-black rounded-2xl hover:bg-white/5 transition-all"
            >
              <HelpCircle size={18} className="mr-2" />
              Get Assistance
            </Button>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="mt-12 flex items-center justify-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Grand Hall
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"><XCircle className="animate-pulse text-rose-500" /></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
