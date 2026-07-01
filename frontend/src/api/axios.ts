import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true, // Send HTTP-only cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;





