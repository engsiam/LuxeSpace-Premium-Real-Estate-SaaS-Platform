'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Property } from '@/types';
import axios from 'axios';
import { toast } from 'sonner';
import { Heart, Home, Trash2 } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchProperties = async () => {
      if (items.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/properties?limit=100`, {
          withCredentials: true,
        });
        const allProperties = response.data.data || [];

        const wishlistProperties = allProperties.filter((p: Property) =>
          items.includes(p.id)
        );

        setProperties(wishlistProperties);
      } catch {
        toast.error('Failed to fetch wishlist properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [items, mounted]);

  const handleRemove = (propertyId: string) => {
    useWishlistStore.getState().removeFromWishlist(propertyId);
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    toast.success('Removed from wishlist');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Favorites</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Wishlist</span></h1>
      </div>

      {loading ? (
        <div className="min-h-[300px] md:min-h-[400px] flex items-center justify-center">
          <div className="text-primary font-bold animate-pulse">Loading wishlist...</div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-card border border-border shadow-xl rounded-xl lg:rounded-2xl overflow-hidden p-6 md:p-12">
          <div className="text-center py-8 md:py-12">
            <div className="w-16 md:w-20 h-16 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary">
              <Heart size={28} />
            </div>
            <p className="text-muted-foreground mb-2 text-base md:text-lg font-medium">Your wishlist is empty</p>
            <p className="text-muted-foreground mb-4 md:mb-6 text-sm">Start exploring and save properties you love</p>
            <Link href="/explore">
              <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
                <Home size={18} className="mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border shadow-xl rounded-xl lg:rounded-2xl overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Heart size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Saved Properties</h2>
              <p className="text-sm text-muted-foreground">{properties.length} properties saved</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative group">
                <PropertyCard property={property} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-600 z-10"
                  onClick={() => handleRemove(property.id)}
                >
                  <Trash2 size={14} className="mr-1" />
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}