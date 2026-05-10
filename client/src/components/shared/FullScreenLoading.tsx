'use client';

import { motion } from 'framer-motion';
import { Globe, Loader2 } from 'lucide-react';

interface FullScreenLoadingProps {
  message?: string;
  subMessage?: string;
}

export default function FullScreenLoading({ message = 'Loading', subMessage }: FullScreenLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020817]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-[3px] border-primary/20 border-t-primary"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-black tracking-tight text-white">
            LUXE<span className="text-primary">SPACE</span>
          </span>
          <span className="text-xs font-black uppercase tracking-[0.4em] text-primary/60">
            {message}
          </span>
          {subMessage && (
            <span className="text-xs font-medium tracking-wide text-white/40">
              {subMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/40">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-medium tracking-wide">Please wait...</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-10 flex items-center gap-2"
      >
        <div className="h-px w-20 bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
          Elite Property Network
        </span>
        <div className="h-px w-20 bg-white/10" />
      </motion.div>
    </motion.div>
  );
}
