// ==========================================
// AXIOS CLIENT — Connection Layer
// ==========================================
// This file is the single source of truth for all HTTP communication.
// Import `axiosClient` anywhere you need to make API calls.
// Token attachment and 401 handling are automatic — no manual headers needed.

import axios from 'axios';

// Base URL comes from the Vite env variable.
// In development the Vite proxy strips "/api" and forwards to localhost:4000.
// In production set VITE_API_URL to your real backend URL (e.g. https://api.taskili.dz/api).
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow cookies / credentials to be sent cross-origin (needed for future sessions)
  withCredentials: true,
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach the JWT Bearer token from localStorage to every request.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// Unwrap data and handle global errors (401 → force logout).
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we are not already on the login / auth pages
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
