import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request for debugging
    console.log('🚀 API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: { 'Content-Type': config.headers['Content-Type'] }
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly if it's wrapped in a success object
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error('Unauthorized access - logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
          
        case 404:
          console.error('Resource not found');
          break;
          
        case 500:
          console.error('Server error - please try again later');
          break;
          
        default:
          console.error('API Error:', data?.message || error.message);
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || error.message,
        data: data
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response from server');
      return Promise.reject({
        message: 'Network error - please check your connection',
        error: error
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: error.message,
        error: error
      });
    }
  }
);

export default axiosInstance;
