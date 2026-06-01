// ============================================
// FILE: axios.js
// PURPOSE: Creates a centralized Axios instance.
//          Configures base URL and auth headers in one place.
//          If the backend URL changes, only this file needs updating.
// CALLED FROM: All pages — import api from '../utils/axios'
// WHY IT'S NEEDED:
//   - Single place to change the backend URL
//   - Auth token is automatically attached to every request
//   - Error handling can be done in one place
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
import axios from 'axios';

// --------------------
// 2. CREATE AXIOS INSTANCE
// --------------------
// axios.create() — creates a new Axios instance with default settings
const api = axios.create({
  // Base URL — uses environment variable if set, otherwise defaults to localhost
  // For production, create a .env file with: VITE_API_URL=https://your-api.com
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',

  // Default headers sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// --------------------
// 3. REQUEST INTERCEPTOR
// --------------------
// Runs before every request.
// Extracts token from localStorage and attaches it to the request header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --------------------
// 4. RESPONSE INTERCEPTOR
// --------------------
// Runs after every response.
// If 401 error (token expired), clears auth and redirects to login.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login with full page reload
      // (preserves no state, ensures clean auth reset)
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// --------------------
// 5. EXPORT
// --------------------
export default api;
