'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw, Globe, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 md:p-16 text-center shadow-3xl overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="relative mb-12">
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-28 h-28 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 relative group-hover:border-primary/50 transition-colors duration-700"
            >
              <ShieldAlert className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary/30" />
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Error Detected</span>
              <div className="w-8 h-px bg-primary/30" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
              Unexpected <span className="text-primary italic">Interruption</span>
            </h1>
            <p className="text-white/40 font-medium text-lg max-w-md mx-auto leading-relaxed">
              Our concierge team has been notified. This temporary lapse in luxury service will be resolved shortly.
            </p>
          </div>

          <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-12 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 opacity-50">Diagnostic Message</p>
            <p className="text-white/60 font-mono text-sm leading-relaxed break-all">
              {error.message || 'The architectural integrity of this page has encountered a structural anomaly.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => reset()} 
              className="h-16 px-10 bg-primary text-secondary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 group"
            >
              <RefreshCcw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              Restore Session
            </Button>
            <Link href="/">
              <Button 
                variant="outline"
                className="h-16 px-10 border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 hover:border-primary/30 transition-all w-full sm:w-auto"
              >
                <Home className="mr-2 w-4 h-4" />
                Return to Grand Hall
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-20">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">LuxeSpace Global Network</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
