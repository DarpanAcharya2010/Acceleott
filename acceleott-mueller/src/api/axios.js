/**
 * ============================================================
 * 🌐 Axios Configuration for Acceleott (Universal Build)
 * ============================================================
 * Supports:
 * - Local development with Netlify Dev (localhost:8888)
 * - Deployed Netlify functions (/.netlify/functions/server/api)
 * - Optional custom backend via VITE_BACKEND_URL
 * ============================================================
 */

import axios from "axios";

/* ============================================================
   🌍 Dynamic Base URL Detection
   ============================================================ */
const fixedBaseURL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:8888/.netlify/functions/server/api" // ✅ Local (netlify dev)
    : "/.netlify/functions/server/api"); // ✅ Netlify production

/* ============================================================
   ⚙️ Axios Instance Setup
   ============================================================ */
const api = axios.create({
  baseURL: fixedBaseURL,
  withCredentials: true, // ✅ allow cookies/JWT sessions
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000, // ✅ Handle slow cold starts
});

/* ============================================================
   🔑 Request Interceptor — Attach JWT Token if exists
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
   🚦 Response Interceptor — Handle Global Errors
   ============================================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 🔒 Auth expired or unauthorized
      if (status === 401 || status === 403) {
        console.warn("⚠️ Unauthorized — redirecting to login...");
        localStorage.removeItem("token");

        // Optional: only redirect if not already on /login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // 💥 Server issues
      if (status >= 500) {
        console.error(
          "🚨 Server Error:",
          error.response.data?.message || "Unexpected backend issue."
        );
      }
    } else if (error.request) {
      console.error("⚠️ No response from backend. Check CORS or connectivity.");
    } else {
      console.error("Axios config error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
