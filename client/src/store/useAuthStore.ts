import { create } from 'zustand';
import axios from 'axios';
import { BASE_URL } from '@/lib/config';

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
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isHydrating: false,  // Changed to false - only used for initial session check
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
      error: null,
      isLoading: false,
    });
  },

  hydrate: async () => {
    set({ isHydrating: true });

    try {
      const response = await axios.get(`${BASE_URL}/users/session`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      if (response.data.success && response.data.data?.isAuthenticated && response.data.data?.user) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
          isHydrating: false,
        });
      } else {
        set({ isHydrating: false, isAuthenticated: false });
      }
    } catch (error: any) {
      console.error('Hydrate error:', error.response?.status, error.response?.data);
      set({ isHydrating: false, isAuthenticated: false });
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