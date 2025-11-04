import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios"; // ✅ Centralized Axios instance
import "./getstarted.css";
import { AuthContext } from "../context/AuthContext";

export default function GetStartedPage() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    occupation: "",
    password: "",
  });

  const [status, setStatus] = useState({ loading: false, message: "", success: null });

  /* -----------------------------------------------------
     ✏️ Handle Input Changes
  ----------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------------------------------
     🚀 Handle Registration Submit
     Automatically works with both local + Netlify env
  ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.loading) return;

    setStatus({ loading: true, message: "🚀 Registering your account...", success: null });

    try {
      // ✅ POST to /auth/register (axios baseURL handles the rest)
      const res = await api.post("/auth/register", form);

      if (res.status === 200 || res.status === 201) {
        const token = res.data?.token || "registered_user";
        localStorage.setItem("token", token);
        setIsAuthenticated(true);

        setStatus({
          loading: false,
          message: res.data?.message || "✅ Registration successful!",
          success: true,
        });

        // Redirect after success
        setTimeout(() => navigate("/", { replace: true }), 1200);
      } else {
        setStatus({
          loading: false,
          message: res.data?.message || "⚠️ Unexpected response from server.",
          success: false,
        });
      }

      // ✅ Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        source: "",
        occupation: "",
        password: "",
      });
    } catch (err) {
      console.error("❌ Registration error:", err);
      const errMsg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "⏱️ Request timed out. Please try again."
          : "❌ Registration failed. Please try again later.");
      setStatus({ loading: false, message: errMsg, success: false });
    }
  };

  /* -----------------------------------------------------
     💅 Render UI
  ----------------------------------------------------- */
  return (
    <div className="page">
      <div className="container">
        {/* LEFT SECTION */}
        <div className="left">
          <div className="arrow" aria-hidden="true">
            ⬇️
          </div>
          <h2>Join Us</h2>
          <p>
            Be part of our growing network — register to get started and stay connected.
          </p>
          <a href="#about" className="btn" aria-label="Learn more about us">
            About Us
          </a>
        </div>

        {/* RIGHT SECTION */}
        <div className="right">
          <h3>Register Here</h3>

          {/* Status Message */}
          {status.message && (
            <div
              className={`alert ${
                status.success === true
                  ? "success"
                  : status.success === false
                  ? "error"
                  : "info"
              }`}
              role="alert"
            >
              {status.message}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={status.loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              disabled={status.loading}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={status.loading}
            />
            <input
              type="text"
              name="source"
              placeholder="Where did you hear about us?"
              value={form.source}
              onChange={handleChange}
              required
              disabled={status.loading}
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={form.occupation}
              onChange={handleChange}
              required
              disabled={status.loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={status.loading}
            />

            <button
              type="submit"
              className="register-btn"
              disabled={status.loading}
              aria-busy={status.loading}
            >
              {status.loading ? "Processing..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
