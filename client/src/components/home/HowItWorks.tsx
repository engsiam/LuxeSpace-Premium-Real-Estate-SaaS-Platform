'use client';

import { motion } from 'framer-motion';
import { Section, Heading, Grid } from '@/design-system/components';

const steps = [
  { step: '01', title: 'Discover', desc: 'Browse our curated collection of premium properties across Bangladesh.' },
  { step: '02', title: 'Connect', desc: 'Reach out to property agents and schedule private viewings instantly.' },
  { step: '03', title: 'Acquire', desc: 'Secure your dream property with our streamlined transaction process.' },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">
              Simple Process
            </span>
          </div>
          <Heading level={2}>How It <span className="text-primary italic">Works</span></Heading>
        </motion.div>
      </div>

      <Grid cols={3}>
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <div className="p-8 bg-card border border-border rounded-2xl h-full hover:border-primary]/30 transition-all duration-500 group">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 text-secondary-foreground text-2xl font-bold">
                {item.step}
              </div>
              <h3 className="text-xl font-medium text-foreground mb-4">{item.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}
