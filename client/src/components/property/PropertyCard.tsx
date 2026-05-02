'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Property } from '@/types';
import { MapPin, BedDouble, Maximize2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function PropertyCard({ property }: { property: Property }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/properties/${property.id}`} className="block h-full">
        <Card className="overflow-hidden h-full border-border bg-card hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group rounded-3xl">
          {/* Minimal Image */}
          <div className="relative h-64 overflow-hidden">
            {property.images?.[0] ? (
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground font-black uppercase tracking-widest text-xs">No Image</span>
              </div>
            )}

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-secondary font-black px-3 py-1 rounded-lg uppercase tracking-widest text-xs border-none backdrop-blur-sm">
                {property.status || 'AVAILABLE'}
              </Badge>
            </div>

            {/* Quick View Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-primary">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* Clean Content */}
          <div className="p-6 space-y-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={14} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">{property.city}</span>
            </div>

            {/* Title */}
            <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {property.title}
            </h3>

            {/* Key Features - Minimal */}
            <div className="flex items-center gap-6 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <BedDouble size={16} className="text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">{property.bhk} BHK</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">{property.size} sqft</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <ShieldCheck size={16} className="text-primary" />
              </div>
            </div>

            {/* Price - Prominent */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-2xl font-black text-foreground tracking-tighter">
                {formatPrice(property.price)}
              </p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Asking Price</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
