import { create } from 'zustand';
import axios from 'axios';
import { BASE_URL } from '@/lib/config';

axios.defaults.withCredentials = true;

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrating: boolean;
  isHydrated: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  refetchSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrating: false,
  isHydrated: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      }, { withCredentials: true });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed');
      }

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, data, {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isHydrated: true,
        isHydrating: false,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
    } catch {
      // Ignore logout errors
    }

    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      isHydrating: false,
      error: null,
      isLoading: false,
    });
  },

  hydrate: async () => {
    const currentUser = get().user;
    const currentIsAuthenticated = get().isAuthenticated;
    
    if (get().isHydrating || get().isHydrated) return;
    if (currentUser && currentIsAuthenticated) {
      set({ isHydrated: true, isHydrating: false });
      return;
    }

    set({ isHydrating: true });

    try {
      const response = await fetch(`${BASE_URL}/users/session`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Session check failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.isAuthenticated && data.data?.user) {
        set({
          user: data.data.user,
          isAuthenticated: true,
          isHydrating: false,
          isHydrated: true,
        });
      } else {
        const shouldKeepUser = currentUser && currentIsAuthenticated;
        set({
          user: shouldKeepUser ? currentUser : null,
          isHydrating: false,
          isAuthenticated: shouldKeepUser ? currentIsAuthenticated : false,
          isHydrated: true,
        });
      }
    } catch (error) {
      console.error('[Hydrate] Session check failed:', error);
      const shouldKeepUser = currentUser && currentIsAuthenticated;
      set({
        user: shouldKeepUser ? currentUser : null,
        isHydrating: false,
        isAuthenticated: shouldKeepUser ? currentIsAuthenticated : false,
        isHydrated: true,
      });
    }
  },

  refetchSession: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/session`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data?.isAuthenticated && response.data.data?.user) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
        });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/session`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data?.isAuthenticated && response.data.data?.user) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
        });
      }
    } catch {
      // Ignore
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsHydrating = () => useAuthStore((state) => state.isHydrating);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useAuth = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const isHydrated = useIsHydrated();
  const isHydrating = useIsHydrating();
  const error = useAuthError();
  
  return { user, isAuthenticated, isLoading, isHydrated, isHydrating, error };
};