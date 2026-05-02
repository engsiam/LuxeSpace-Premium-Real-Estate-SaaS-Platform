import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from NextAuth session
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // Dynamically import to avoid SSR issues
      const { getSession } = await import('next-auth/react');
      const session = await getSession();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { getSession } = await import('next-auth/react');
        const session = await getSession();

        if (session?.refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            { refreshToken: session.refreshToken }
          );

          const { accessToken } = response.data.data;

          // Update session with new token (this would need a custom update)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
