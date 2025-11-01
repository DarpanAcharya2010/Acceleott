// ✅ /src/api/axios.js
import axios from "axios";

/* ------------------------------------------
   🌐 Safe Base URL (Local + Netlify + Vercel)
------------------------------------------ */
const fixedBaseURL =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api" // 🧑‍💻 Local backend
    : "/.netlify/functions/server/api"); // ✅ Production serverless backend path

// Explanation:
// - During local dev: backend runs on http://localhost:5000/api
// - On Netlify: all "/api/*" calls redirect to "/.netlify/functions/server/api/*"
//   (handled by [[redirects]] in netlify.toml)

/* ------------------------------------------
   Create Axios Instance
------------------------------------------ */
const axiosInstance = axios.create({
  baseURL: fixedBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // more tolerance for cold starts
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
          "🚨 Server Error:",
          error.response.data?.message || "Unexpected backend issue."
        );
      }
    } else if (error.request) {
      console.error("⚠️ No response from server. Check network or CORS.");
    } else {
      console.error("Axios configuration error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
