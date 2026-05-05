'use client';

import { Button } from '@/design-system/components';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Crown, Gem, Building2, Home, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  const features = [
    { icon: Crown, label: 'Exclusive Properties', desc: 'Access premium listings' },
    { icon: Gem, label: 'VIP Concierge', desc: '24/7 dedicated support' },
    { icon: Building2, label: 'Expert Agents', desc: 'Industry professionals' },
  ];

  const stats = [
    { value: '250+', label: 'Elite Properties' },
    { value: '45+', label: 'Expert Agents' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -skew-x-12" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Main Card */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-16 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            <div className="absolute top-4 right-4 w-24 h-24 border border-primary/20 rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border border-primary/20 rounded-full" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 backdrop-blur-xl"
                >
                  <Sparkles size={16} className="text-primary animate-pulse" />
                  <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">Ready for Excellence?</span>
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
                >
                  Begin Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary">
                    Elite Journey
                  </span>
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
                >
                  Join an exclusive network of discerning property enthusiasts. 
                  Experience world-class real estate services tailored to your unique needs.
                </motion.p>

                {/* Features */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="grid sm:grid-cols-3 gap-4"
                >
                  {features.map((feature, idx) => (
                    <div key={idx} className="p-4 bg-background/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors group">
                      <feature.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-sm mb-1">{feature.label}</h4>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-start gap-4"
                >
                  <Link href="/explore">
                    <Button className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-wider inline-flex items-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                      <span>Explore Estates</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      variant="outline" 
                      className="h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Contact Concierge
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full aspect-square">
                  {/* Main Circle */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20" />
                  
                  {/* Inner Ring */}
                  <div className="absolute inset-16 rounded-full border border-dashed border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-black">LUXE</h3>
                      <p className="text-sm text-muted-foreground">Premium Access</p>
                    </div>
                  </div>

                  {/* Floating Stats */}
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      style={{
                        top: idx === 0 ? '10%' : idx === 1 ? '50%' : '75%',
                        left: idx === 1 ? '0%' : 'auto',
                        right: idx !== 1 ? '0%' : 'auto',
                        transform: idx === 1 ? 'translateY(-50%)' : 'none',
                      }}
                    >
                      <p className="text-2xl font-black text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Contact Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center"
        >
          <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Gulshan-2, Dhaka</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Phone className="w-5 h-5" />
            <span className="font-medium">+880 123 456 789</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Mail className="w-5 h-5" />
            <span className="font-medium">concierge@luxespace.com</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}