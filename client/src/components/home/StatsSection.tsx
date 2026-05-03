'use client';

import { motion } from 'framer-motion';
import { Section, Heading, Grid } from '@/design-system/components';

const stats = [
  { value: '250+', label: 'Curated Estates' },
  { value: '45+', label: 'Elite Agents' },
  { value: '1200+', label: 'Success Stories' },
  { value: '8', label: 'Cities Covered' },
];

export default function StatsSection() {
  return (
    <Section className="bg-primary">
      <Grid cols={4}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="text-4xl md:text-7xl font-bold text-secondary-foreground tracking-tight mb-4 group-hover:scale-110 transition-transform duration-500">
              {stat.value}
            </div>
            <div className="h-0.5 w-12 bg-background/30 mx-auto mb-4 group-hover:w-20 transition-all duration-500" />
            <div className="text-secondary-foreground/80 font-bold uppercase tracking-[0.3em] text-xs">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}
