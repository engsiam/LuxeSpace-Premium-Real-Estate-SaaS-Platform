'use client';

import { motion } from 'framer-motion';
import { Property } from '@/types';
import { PropertyCard } from '@/design-system/components';

interface PropertyCardWrapperProps {
  property: Property;
  index?: number;
}

export function PropertyCardWrapper({ property, index = 0 }: PropertyCardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full flex flex-col"
    >
      <PropertyCard
        id={property.id}
        title={property.title}
        price={property.price}
        city={property.city}
        bhk={property.bhk}
        size={property.size}
        status={property.status}
        images={property.images}
      />
    </motion.div>
  );
}
