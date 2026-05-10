'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

interface WishlistButtonProps {
  propertyId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({ propertyId, className = '', size = 'md' }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const isWishlisted = isInWishlist(propertyId);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isWishlisted) {
      removeFromWishlist(propertyId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(propertyId);
      toast.success('Added to wishlist');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizes[size]}
        rounded-xl backdrop-blur-md border flex items-center justify-center transition-all
        ${isWishlisted 
          ? 'bg-rose-500/80 border-rose-500 text-white hover:bg-rose-600' 
          : 'bg-white/10 border-white/10 text-white hover:bg-rose-500 hover:border-rose-500'
        }
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
    >
      <Heart 
        size={iconSizes[size]} 
        className={`transition-all ${isWishlisted ? 'fill-current' : ''}`} 
      />
    </button>
  );
}
