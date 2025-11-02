import axios from "axios";

/* ============================================================
   🌐 Dynamic Base URL — Local Dev + Netlify Production
   ============================================================
   🧠 Logic:
   - Local (when using `netlify dev`): 
       http://localhost:8888/.netlify/functions/server/api
   - Production (Netlify deploy): 
       /.netlify/functions/server/api
   - Optional override: VITE_BACKEND_URL in .env
============================================================ */
const fixedBaseURL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:8888/.netlify/functions/server/api" // ✅ Local Netlify dev
    : "/.netlify/functions/server/api"); // ✅ Production (Netlify deploy)

/* ============================================================
   ⚙️ Axios Instance
============================================================ */
const axiosInstance = axios.create({
  baseURL: fixedBaseURL,
  withCredentials: true, // for cookies / auth sessions
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000, // handles Netlify cold starts
});

/* ============================================================
   🔑 Request Interceptor — Attach JWT if present
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   🚦 Response Interceptor — Global Error Handling
============================================================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 🔒 Auth issues
      if (status === 401 || status === 403) {
        console.warn("⚠️ Unauthorized — redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // 💥 Server errors
      if (status >= 500) {
        console.error(
          "🚨 Server Error:",
          error.response.data?.message || "Unexpected backend issue."
        );
      }
    } else if (error.request) {
      console.error("⚠️ No response from backend. Check CORS or network.");
    } else {
      console.error("Axios configuration error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
