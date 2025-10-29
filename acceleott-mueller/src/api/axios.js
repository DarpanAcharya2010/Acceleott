// ✅ /src/api/axios.js
import axios from "axios";

/* ------------------------------------------
   Environment-Safe Base URL
------------------------------------------ */
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api" // Local dev fallback
    : "https://api.acceleott.com/api"); // ✅ Replace with your prod API endpoint

/* ------------------------------------------
   Create Axios Instance
------------------------------------------ */
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Needed for cookies/sessions (CORS must allow)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // ⏱ prevent hanging requests
});

/* ------------------------------------------
   Request Interceptor
------------------------------------------ */
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach token if available
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    // ✅ Centralized error handling for production
    if (error.response) {
      const { status } = error.response;

      // Token expired or unauthorized
      if (status === 401 || status === 403) {
        console.warn("Unauthorized. Logging out...");
        localStorage.removeItem("accessToken");
        // Optionally redirect to login
        window.location.href = "/login";
      }

      // Log server errors in production with controlled message
      if (status >= 500) {
        console.error("Server Error:", error.response.data?.message || error.message);
      }
    } else if (error.request) {
      console.error("No response from server. Check network connection.");
    } else {
      console.error("Axios config error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
