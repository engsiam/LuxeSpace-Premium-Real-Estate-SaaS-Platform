'use client';

import { Button } from '@/design-system/components';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 -skew-x-12 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Internal Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-primary text-xs font-bold uppercase tracking-[0.4em]">Ready for Excellence?</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Begin your journey <br />
              <span className="text-primary italic">to the top</span>
            </h2>
            
            <p className="text-muted-foreground text-base font-medium leading-relaxed">
              Join the elite network of property owners and seekers. Experience the pinnacle of real estate discovery in Bangladesh.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/explore">
                <Button size="lg" className="inline-flex items-center gap-3">
                  <span>EXPLORE ESTATES</span>
                  <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="inline-flex items-center gap-3">
                  CONTACT CONCIERGE
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
