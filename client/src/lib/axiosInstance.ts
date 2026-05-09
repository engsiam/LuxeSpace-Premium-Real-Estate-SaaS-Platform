import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 503) {
      console.error('[API] Service unavailable (503):', originalRequest.url);
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/users/session`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('[API] Session refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;