'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Property } from '@/types';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { Heart, Home } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/properties?limit=100');
        const allProperties = response.data.data || [];

        const wishlistProperties = allProperties.filter((p: Property) =>
          items.includes(p.id)
        );

        setProperties(wishlistProperties);
      } catch (error) {
        toast.error('Failed to fetch wishlist properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [items]);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-8 w-64 bg-card animate-pulse rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-card animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Favorites</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Wishlist</span></h1>
      </div>

      {properties.length === 0 ? (
        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-12">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Heart size={36} />
            </div>
            <p className="text-muted-foreground mb-6 text-lg">Your wishlist is empty</p>
            <Link href="/explore">
              <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
                <Home size={18} className="mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Heart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Saved Properties</h2>
              <p className="text-sm text-muted-foreground">{properties.length} properties saved</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative group">
                <PropertyCard property={property} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWishlist(property.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
