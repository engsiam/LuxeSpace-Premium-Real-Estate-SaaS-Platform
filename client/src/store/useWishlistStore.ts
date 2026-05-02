import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (propertyId) =>
        set((state) => ({
          items: [...state.items, propertyId],
        })),
      removeFromWishlist: (propertyId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== propertyId),
        })),
      isInWishlist: (propertyId) => get().items.includes(propertyId),
    }),
    {
      name: 'luxespace-wishlist',
    }
  )
);
