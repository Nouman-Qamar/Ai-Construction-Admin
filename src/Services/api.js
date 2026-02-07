import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Attach JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasToken: !!token
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
    (response) => response.data, 
    (error) => {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'An error occurred';

        console.error('API Error:', message);

        // Handle 401 Unauthorized - logout user
        if (error.response?.status === 401) {
            console.error('Unauthorized - clearing auth and redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
