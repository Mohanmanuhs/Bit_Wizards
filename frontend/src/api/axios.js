// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;