import axios from "axios";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    let token = null;

    // Get live JWT token from Clerk if available in browser
    try {
      if (typeof window !== "undefined" && window.Clerk?.session) {
        token = await window.Clerk.session.getToken();
      }
    } catch (e) {
      console.warn("Clerk session token retrieval note:", e.message);
    }

    if (!token) {
      token = storage.getToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      storage.removeToken();
      // AuthContext and Clerk handle redirect if unauthenticated
    }

    return Promise.reject(error);
  }
);

export default api;