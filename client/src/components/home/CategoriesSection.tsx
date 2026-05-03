'use client';

import { motion } from 'framer-motion';
import { Section, Heading, Grid, Button } from '@/design-system/components';
import Link from 'next/link';

const categories = [
  { name: 'Luxury Apartments', type: 'Luxury Apartment', count: '120+' },
  { name: 'Penthouses', type: 'Penthouse', count: '45+' },
  { name: 'Commercial Spaces', type: 'Commercial Space', count: '80+' },
  { name: 'Villas', type: 'Villa', count: '35+' },
];

export default function CategoriesSection() {
  return (
    <Section id="categories">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">
              Categories
            </span>
          </div>
          <Heading level={2}>Browse by <span className="text-primary italic">Category</span></Heading>
        </motion.div>
      </div>

      <Grid cols={4}>
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/explore?type=${encodeURIComponent(cat.type)}`}>
              <div className="p-8 bg-card border border-border rounded-2xl text-center hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary text-4xl mx-auto">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-muted-foreground text-sm">{cat.count} Properties</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}
