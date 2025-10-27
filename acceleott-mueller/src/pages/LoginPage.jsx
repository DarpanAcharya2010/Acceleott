import React, { useState, useContext } from "react";
import axios from "axios";
import "./loginpage.css";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Login successful!");

      // ✅ Save token in localStorage (unified key)
      localStorage.setItem("token", res.data.token || "temp_token");

      // ✅ Update context immediately
      setIsAuthenticated(true);

      // ✅ Redirect after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "❌ Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left side */}
        <div className="auth-left">
          <div className="arrow">⬇️</div>
          <h2>Join Us</h2>
          <p>Access your Acceleott account and explore services.</p>
          <a href="#about" className="btn">About Us</a>
        </div>

        {/* Right side (form) */}
        <form className="auth-form" onSubmit={handleLogin}>
          <h3 className="welcome-title">Welcome Back</h3>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>

          {message && (
            <p
              className={`message ${
                message.toLowerCase().includes("success")
                  ? "success"
                  : "error"
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
