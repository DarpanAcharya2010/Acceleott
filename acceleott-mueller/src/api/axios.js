/**
 * ============================================================
 * 🌐 Axios Configuration for Acceleott (Universal Build)
 * ============================================================
 * Works with:
 * - 🧩 Local dev (Netlify Dev → http://localhost:8888)
 * - ☁️ Netlify Production Functions (/.netlify/functions/server/api)
 * - ⚙️ Optional: Custom backend via VITE_BACKEND_URL
 * ============================================================
 */

import axios from "axios";

/* ============================================================
   🌍 Dynamic Base URL Detection
   ============================================================ */
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:8888/.netlify/functions/server/api" // ✅ Local
    : "/.netlify/functions/server/api"); // ✅ Production (Netlify)

/* ============================================================
   ⚙️ Axios Instance Setup
   ============================================================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/.netlify/functions/server",
});

/* ============================================================
   🔑 Request Interceptor — Attach JWT Token if available
   ============================================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   🚦 Response Interceptor — Handle Auth + Server Errors
   ============================================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 🔒 Token expired or invalid
      if (status === 401 || status === 403) {
        console.warn("⚠️ Unauthorized — redirecting to login...");
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // 💥 Server-side error
      if (status >= 500) {
        console.error("🚨 Server Error:", data?.message || "Unexpected backend issue.");
      }
    } else if (error.request) {
      console.error("⚠️ No response from backend. Check CORS or connectivity.");
    } else {
      console.error("Axios config error:", error.message);
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   🧩 Auth Routes
   ============================================================ */
export const authAPI = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

/* ============================================================
   📩 Demo Routes
   ============================================================ */
export const demoAPI = {
  requestDemo: (payload) => api.post("/demo", payload),
  list: () => api.get("/demo"),
};

/* ============================================================
   🚀 Get Started (Contact) Routes
   ============================================================ */
export const getStartedAPI = {
  submit: (payload) => api.post("/getstarted", payload),
};

export default api;
