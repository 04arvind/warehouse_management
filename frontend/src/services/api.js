import axios from "axios";
import { storage } from "../utils/storage";

// Normalize the API base URL so it always ends with /api
// Handles cases like:
//   https://backend.vercel.app        → https://backend.vercel.app/api
//   https://backend.vercel.app/       → https://backend.vercel.app/api
//   https://backend.vercel.app/api    → https://backend.vercel.app/api
//   https://backend.vercel.app/api/   → https://backend.vercel.app/api
const rawUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const normalizeBaseUrl = (url) => {
  const stripped = url.replace(/\/+$/, ""); // remove trailing slashes
  return stripped.endsWith("/api") ? stripped : `${stripped}/api`;
};

const BASE_URL = normalizeBaseUrl(rawUrl);

const api = axios.create({
  baseURL: BASE_URL,

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