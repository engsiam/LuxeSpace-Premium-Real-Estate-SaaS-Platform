import { create } from 'zustand';

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  } | null;
  setUser: (user: UserState['user']) => void;
  updateAvatar: (avatar: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateAvatar: (avatar) => set((state) => {
    if (state.user) {
      return { user: { ...state.user, avatar } };
    }
    return state;
  }),
  clearUser: () => set({ user: null }),
}));