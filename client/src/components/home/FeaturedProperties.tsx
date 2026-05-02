'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PropertyCardWrapper } from '@/components/property/PropertyCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { Heading, Section, Grid } from '@/design-system/components';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get('/properties/featured');
        setProperties(response.data.data || []);
      } catch (error) {
        // Handled
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <Section>
        <Skeleton className="h-10 w-64 mb-8" />
        <Grid cols={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </Grid>
      </Section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">The Collection</span>
          </div>
          <Heading level={2}>Featured <span className="text-primary italic">Residences</span></Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground max-w-md text-base leading-relaxed">
            A curated selection of Bangladesh's most exclusive properties, verified for quality and prestige.
          </p>
        </motion.div>
      </div>

      <Grid cols={4}>
        {properties.map((property, index) => (
          <PropertyCardWrapper key={property.id} property={property} index={index} />
        ))}
      </Grid>
    </Section>
  );
}
