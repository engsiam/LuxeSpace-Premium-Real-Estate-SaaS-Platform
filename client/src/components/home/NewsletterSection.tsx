'use client';

import { useState } from 'react';
import { Button } from '@/design-system/components';
import { Send, BellRing, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Welcome to the elite list. Stay tuned for excellence!');
    setEmail('');
  };

  return (
    <section className="py-16 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary animate-bounce">
              <BellRing size={36} />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Stay Ahead of <span className="text-primary italic">the Curve</span>
              </h2>
              <p className="text-muted-foreground text-base font-medium leading-relaxed">
                Receive exclusive invitations to private viewings and early access to Bangladesh's most anticipated property launches.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input 
                  type="email"
                  placeholder="Enter your private email"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A74D] text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button size="lg">SUBSCRIBE</Button>
            </form>

            <div className="flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span>Data Confidentiality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span>No Third-Party Distribution</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
