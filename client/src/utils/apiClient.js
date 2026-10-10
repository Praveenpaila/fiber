import axios from 'axios';

// Base API client
// In local development, defaults to relative /api (proxied by Vite to port 5000)
// In production on Vercel, uses VITE_API_URL (e.g. https://fiberlab-api.onrender.com)
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  timeout: 12000
});

export default api;
