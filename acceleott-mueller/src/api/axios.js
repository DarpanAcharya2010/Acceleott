// ✅ /src/api/axios.js
import axios from "axios";

/* ------------------------------------------
   🌐 Safe Base URL (Works for Local + Netlify + Vercel)
------------------------------------------ */
const baseURL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api" // 🧑‍💻 Local development
    : "/.netlify/functions/server/api"); // 🌍 Production (Netlify serverless function)

/* ------------------------------------------
   Create Axios Instance
------------------------------------------ */
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

/* ------------------------------------------
   Request Interceptor
------------------------------------------ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------------------
   Response Interceptor
------------------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        console.warn("Session expired or unauthorized. Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (status >= 500) {
        console.error(
          "Server Error:",
          error.response.data?.message || "Unexpected error occurred."
        );
      }
    } else if (error.request) {
      console.error("No response from server. Check network or CORS.");
    } else {
      console.error("Axios configuration error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
