import React, { useState, useContext } from "react";
import api from "@/api/axios"; // ✅ centralized Axios instance
import "./getstarted.css";
import { AuthContext } from "../context/AuthContext";

const GetStartedPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    occupation: "",
    password: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });
  const [loading, setLoading] = useState(false);

  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus({ success: null, message: "Submitting..." });

    try {
      /**
       * 🧩 Fixed endpoint:
       *   Old: api.post("/api/auth/register", formData)
       *   New: api.post("/auth/register", formData)
       *
       * Because our axios baseURL already includes `/api`
       * so the final resolved URL becomes:
       *   - http://localhost:5000/api/auth/register  ✅ (local)
       *   - /.netlify/functions/server/api/auth/register ✅ (production)
       */
      const res = await api.post("/auth/register", formData);

      setStatus({
        success: true,
        message: res?.data?.message || "✅ Registered successfully!",
      });

      if (res.status === 200 || res.status === 201) {
        // Save token or fallback key
        const token = res.data?.token || "registered_user";
        localStorage.setItem("token", token);
        setIsAuthenticated(true);

        // Redirect after success
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "",
        occupation: "",
        password: "",
      });
    } catch (err) {
      console.error("Registration Error:", err);

      setStatus({
        success: false,
        message:
          err?.response?.data?.message ||
          "❌ Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Be a part of our growing network — register to get started and stay
            connected.
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
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="source"
              placeholder="Where did you hear about us?"
              value={formData.source}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
