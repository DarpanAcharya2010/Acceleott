import React, { useState, useContext } from "react";
import api from "@/api/axios"; // ✅ uses your centralized config
import "./getstarted.css"; // keep your existing CSS
import { AuthContext } from "../context/AuthContext"; // ✅ Added import

const GetStartedPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext); // ✅ Added context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    occupation: "",
    password: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });

  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, message: "Submitting..." });

    try {
      // ✅ Backend registration endpoint
      const res = await api.post("/auth/register", formData);


      setStatus({
        success: true,
        message: res?.data?.message || "✅ Registered successfully!",
      });

      if (res.status === 201 || res.status === 200) {
        // ✅ Save login state (so buttons hide)
        localStorage.setItem("token", res.data?.token || "registered_user");
        setIsAuthenticated(true);

        // ✅ Redirect to home
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
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Left section */}
        <div className="left">
          <div className="arrow">⬇️</div>
          <h2>Join Us</h2>
          <p>
            Be a part of our growing network — register to get started and stay
            connected.
          </p>
          <a href="#about" className="btn">
            About Us
          </a>
        </div>

        {/* Right section */}
        <div className="right">
          <h3>Register Here</h3>

          {/* Status message */}
          {status.message && (
            <div
              className={`alert ${
                status.success === true
                  ? "success"
                  : status.success === false
                  ? "error"
                  : "info"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit}>
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
            />
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
