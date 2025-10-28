import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // For server-side requests (SSR/SSG)
  if (typeof window === 'undefined') {
    // In production, use your actual domain
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1`;
    }
    // In development, use localhost
    return 'http://localhost:3000/api/v1';
  }
  
  // For client-side requests, use relative URL
  return '/api/v1';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if it exists
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received', error.request);
    } else {
      // Something else happened
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;