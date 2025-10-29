import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios"; // ✅ Centralized Axios instance
import "./loginpage.css";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("🔐 Logging in...");

    try {
      // ✅ Send credentials
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save token securely in localStorage
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true); // instantly update context
      }

      // ✅ Success feedback
      setMessage(res.data.message || "✅ Login successful!");
      console.log("Login response:", res.data);

      // ✅ Smooth redirect (no reload)
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Safe message
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "❌ Login failed. Please check your credentials.";

      setMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Section */}
        <div className="auth-left">
          <div className="arrow">⬇️</div>
          <h2>Join Us</h2>
          <p>Access your Acceleott account and explore services.</p>
          <a href="#about" className="btn">
            About Us
          </a>
        </div>

        {/* Right Section */}
        <form className="auth-form" onSubmit={handleLogin}>
          <h3 className="welcome-title">Welcome Back</h3>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Login"}
          </button>

          {message && (
            <p
              className={`message ${
                message.toLowerCase().includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
