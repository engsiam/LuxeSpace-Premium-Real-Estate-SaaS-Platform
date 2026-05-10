import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useWishlistItems = () => {
  const items = useWishlistStore((state) => state.items);
  const hasHydrated = useWishlistStore((state) => state._hasHydrated);
  return { items, hasHydrated };
};
