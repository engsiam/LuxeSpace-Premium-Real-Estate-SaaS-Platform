'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, CreditCard, Lock, ArrowRight } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

function PaymentProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'verifying' | 'redirecting'>('checking');
  
  const invoice = searchParams.get('invoice');
  const amount = searchParams.get('amount');
  const method = searchParams.get('method');

  useEffect(() => {
    if (!invoice) {
      toast.error('Invalid payment request');
      router.push('/');
      return;
    }

    const processPayment = async () => {
      try {
        // Step 1: Simulated "Checking with Gateway" delay
        await new Promise(r => setTimeout(r, 1500));
        setStatus('verifying');

        // Step 2: Call backend to execute/verify the mock payment
        // We simulate sending a paymentID like bKash would
        const response = await axiosInstance.post('/bookings/execute', {
          paymentID: 'MOCK_PAYMENT_' + Date.now(),
          invoice,
          method: method || 'bkash'
        });

        if (response.data.success && response.data.data.success) {
          setStatus('redirecting');
          await new Promise(r => setTimeout(r, 1000));
          router.push(`/payment/success?invoice=${invoice}&trx=${response.data.data.transactionId}`);
        } else {
          router.push(`/payment/failed?invoice=${invoice}&reason=${response.data.data.message || 'Payment Declined'}`);
        }
      } catch (error) {
        router.push(`/payment/failed?invoice=${invoice}&reason=Gateway Timeout`);
      }
    };

    processPayment();
  }, [invoice, router, method]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1F2E] border border-white/5 rounded-[2.5rem] p-10 shadow-3xl relative overflow-hidden">
        {/* bKash-like header branding */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D12053] via-[#E2136E] to-[#D12053]" />
        
        <div className="text-center space-y-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </motion.div>

          <div>
            <h1 className="text-2xl font-black text-white mb-2">Securing Transaction</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Merchant: LuxeSpace Properties Ltd.</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Amount</span>
              <span className="text-xl font-black text-white">৳{amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Invoice</span>
              <span className="text-sm font-bold text-white/80">{invoice?.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-3"
              >
                {status === 'checking' && <p className="text-primary font-black uppercase tracking-widest text-xs">Authenticating Wallet...</p>}
                {status === 'verifying' && <p className="text-emerald-500 font-black uppercase tracking-widest text-xs">Verifying Funds...</p>}
                {status === 'redirecting' && <p className="text-white font-black uppercase tracking-widest text-xs">Finalizing Settlement...</p>}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 text-[9px] text-white/20 font-black uppercase tracking-[0.2em] pt-4">
              <Lock size={12} />
              End-to-End Encrypted Session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <PaymentProcessingContent />
    </Suspense>
  );
}
