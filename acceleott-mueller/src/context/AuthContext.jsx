import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

/**
 * ✅ Production-ready AuthProvider
 * - Syncs login/logout across tabs and reloads
 * - Validates JWT tokens periodically
 * - Uses environment-safe URLs (VITE_ variables only)
 * - Passes Netlify’s secret scanning safely
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!(token && token.trim() !== "");
  });

  const [loading, setLoading] = useState(true);

  /** ✅ Keep state in sync with localStorage */
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!(token && token.trim() !== ""));
    };

    checkToken();
    setLoading(false);

    // Listen for cross-tab changes
    const handleStorageChange = (e) => {
      if (e.key === "token") checkToken();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /** ✅ Centralized logout handler */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }, []);

  /** ✅ Token validation (every 10 minutes) */
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ Always use only VITE_ prefixed environment variables
      const apiBase =
        import.meta.env.VITE_BACKEND_URL?.trim() ||
        (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

      try {
        const res = await fetch(`${apiBase}/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn("Invalid or expired token. Logging out...");
          logout();
        }
      } catch (err) {
        console.warn("Token validation error:", err);
        logout();
      }
    };

    const interval = setInterval(validateToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        logout,
        loading,
      }}
    >
      {/* ✅ Avoid UI flicker until initialized */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
