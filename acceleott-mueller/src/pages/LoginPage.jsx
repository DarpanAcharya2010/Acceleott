import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios"; // ✅ Centralized Axios instance
import "./loginpage.css";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, message: "", success: null });
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------
     ✏️ Handle input changes
  ----------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------------------------------
     🚀 Handle Login Submit
  ----------------------------------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (status.loading) return;

    setStatus({ loading: true, message: "🔐 Logging in...", success: null });

    try {
      // ✅ POST to /auth/login (Axios baseURL handles the prefix)
      const res = await api.post("/auth/login", form);

      // ✅ On success
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
        setStatus({
          loading: false,
          message: res.data.message || "✅ Login successful!",
          success: true,
        });

        // Redirect after short delay
        setTimeout(() => navigate("/", { replace: true }), 800);
      } else {
        setStatus({
          loading: false,
          message: res.data.message || "❌ Invalid response from server.",
          success: false,
        });
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errMsg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "⏱️ Request timed out. Please try again."
          : "❌ Login failed. Please check your credentials.");
      setStatus({ loading: false, message: errMsg, success: false });
    }
  };

  /* -----------------------------------------------------
     💅 Render UI
  ----------------------------------------------------- */
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Section */}
        <div className="auth-left">
          <div className="arrow">⬇️</div>
          <h2>Join Us</h2>
          <p>Access your Acceleott account and explore our services.</p>
          <a href="#about" className="btn">
            About Us
          </a>
        </div>

        {/* Right Section */}
        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <h3 className="welcome-title">Welcome Back</h3>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={status.loading}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={status.loading}
            required
          />

          <button type="submit" disabled={status.loading}>
            {status.loading ? "Please wait..." : "Login"}
          </button>

          {status.message && (
            <p
              className={`message ${
                status.success === true
                  ? "success"
                  : status.success === false
                  ? "error"
                  : "info"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
