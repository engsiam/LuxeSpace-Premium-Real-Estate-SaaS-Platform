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
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<boolean>;

  logout: () => Promise<void>;
  hydrate: (retries?: number) => Promise<void>;
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
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed');
      }

      console.log('[Login] Success:', response.data);

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
        isHydrated: false,
      });

      // verify backend session after cookie set
      await get().hydrate();

      return true;
    } catch (error: any) {
      console.error('[Login] Failed:', error);

      const message =
        error.response?.data?.error ||
        error.message ||
        'Login failed';

      set({
        isLoading: false,
        error: message,
      });

      return false;
    }
  },

  register: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        data,
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
        isHydrated: false,
      });

      await get().hydrate();

      return true;
    } catch (error: any) {
      console.error('[Register] Failed:', error);

      const message =
        error.response?.data?.error ||
        'Registration failed';

      set({
        isLoading: false,
        error: message,
      });

      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(
        `${BASE_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error('[Logout] Error:', error);
    }

    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      isHydrating: false,
      isLoading: false,
      error: null,
    });
  },

  hydrate: async (retries = 0) => {
    if (get().isHydrating) return;

    console.log('[Hydrate] Starting...');

    set({
      isHydrating: true,
    });

    try {
      const response = await fetch(
        `${BASE_URL}/users/session`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 503 && retries < 3) {
        console.log(
          `[Hydrate] Backend sleeping, retry ${retries + 1
          }/3...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );

        return get().hydrate(retries + 1);
      }

      if (!response.ok) {
        throw new Error(
          `Session check failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log('[Hydrate] Session response:', data);

      if (
        data?.success &&
        data?.data?.isAuthenticated &&
        data?.data?.user
      ) {
        console.log(
          '[Hydrate] Authenticated:',
          data.data.user.email
        );

        set({
          user: data.data.user,
          isAuthenticated: true,
          isHydrated: true,
          isHydrating: false,
        });

        return;
      }

      console.log('[Hydrate] No active session');

      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
        isHydrating: false,
      });
    } catch (error) {
      console.error('[Hydrate] Failed:', error);

      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
        isHydrating: false,
      });
    }
  },

  refetchSession: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/session`,
        {
          withCredentials: true,
        }
      );

      if (
        response.data.success &&
        response.data.data?.isAuthenticated &&
        response.data.data?.user
      ) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('[RefetchSession] Failed:', error);

      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/session`,
        {
          withCredentials: true,
        }
      );

      if (
        response.data.success &&
        response.data.data?.isAuthenticated &&
        response.data.data?.user
      ) {
        set({
          user: response.data.data.user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('[FetchCurrentUser] Failed:', error);
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export const useUser = () =>
  useAuthStore((state) => state.user);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useIsHydrating = () =>
  useAuthStore((state) => state.isHydrating);

export const useIsHydrated = () =>
  useAuthStore((state) => state.isHydrated);

export const useIsLoading = () =>
  useAuthStore((state) => state.isLoading);

export const useAuthError = () =>
  useAuthStore((state) => state.error);

export const useAuth = () => {
  const user = useUser();

  const isAuthenticated = useIsAuthenticated();

  const isLoading = useIsLoading();

  const isHydrated = useIsHydrated();

  const isHydrating = useIsHydrating();

  const error = useAuthError();

  return {
    user,
    isAuthenticated,
    isLoading,
    isHydrated,
    isHydrating,
    error,
  };
};