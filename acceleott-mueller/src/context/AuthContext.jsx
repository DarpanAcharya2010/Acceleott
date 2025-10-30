import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

/**
 * Enhanced Production-ready AuthProvider
 * - Instantly reflects login/logout across components.
 * - Syncs across tabs and page reloads.
 * - Periodically validates tokens (for backend sessions).
 * - Prevents UI flicker during initialization.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // ✅ Initialize from localStorage synchronously (prevents flicker)
    const token = localStorage.getItem("token");
    return !!(token && token.trim() !== "");
  });
  const [loading, setLoading] = useState(true);

  /** ✅ Always keep state in sync with localStorage */
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!(token && token.trim() !== ""));
    };

    // Initial check
    checkToken();
    setLoading(false);

    // ✅ Listen for changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /** ✅ Central logout handler (used globally) */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Optional redirect
    window.location.href = "/login";
  }, []);

  /** ✅ Token validation (runs every 10 minutes for security) */
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 🛠️ MODIFICATION: Determine the correct API base URL for deployment/development
      const apiBase =
        import.meta.env.VITE_API_BASE_URL?.trim() ||
        (import.meta.env.DEV ? "http://localhost:5000/api" : "/api"); // Use relative path '/api' on Vercel

      try {
        const res = await fetch(
          `${apiBase}/auth/validate`, // Use the determined apiBase URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.warn("Invalid token detected. Logging out...");
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
      {/* ✅ Render only after initialization */}
      {!loading && children}
    </AuthContext.Provider>
  );
};