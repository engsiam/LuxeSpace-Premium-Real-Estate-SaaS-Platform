'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PropertyCardWrapper } from '@/components/property/PropertyCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';
import { Heading, Section, Grid } from '@/design-system/components';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get('/properties?limit=8');
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
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </Grid>
      </Section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
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
          <Link href="/explore">
            <Button className="bg-primary text-secondary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors">
              View All Properties
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>
      </div>

      <Grid cols={4}>
        {properties.slice(0, 8).map((property, index) => (
          <PropertyCardWrapper key={property.id} property={property} index={index} />
        ))}
      </Grid>
    </Section>
  );
}
