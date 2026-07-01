import axios from 'axios';

const fallbackApiUrl = 'https://multi-tenant-backend.azurewebsites.net';
const apiBaseUrl = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Send HTTP-only cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;





