// src/pages/DemoRequestPage.jsx
import React, { useState } from "react";
import api from "@/api/axios"; // ✅ Centralized Axios instance
import "./demopage.css";

export default function DemoRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    designation: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------
     ✏️ Handle input changes
  ----------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------------------------------
     ✅ Validate form fields
  ----------------------------------------------------- */
  const validateForm = () => {
    const { name, email, contact } = formData;
    if (!name.trim() || !email.trim() || !contact.trim()) {
      setStatus({
        success: false,
        message: "⚠️ Please fill in all required fields.",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-()\s]{7,15}$/;

    if (!emailRegex.test(email)) {
      setStatus({
        success: false,
        message: "⚠️ Please enter a valid email address.",
      });
      return false;
    }

    if (!phoneRegex.test(contact)) {
      setStatus({
        success: false,
        message: "⚠️ Please enter a valid contact number.",
      });
      return false;
    }

    return true;
  };

  /* -----------------------------------------------------
     🚀 Handle form submission
  ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);
    setStatus({ success: null, message: "Submitting your request..." });

    try {
      // ✅ Automatically routed by Netlify proxy in dev
      const res = await api.post("/.netlify/functions/server/api/demo", formData);

      setStatus({
        success: true,
        message:
          res?.data?.message || "✅ Demo request submitted successfully!",
      });

      // ✅ Reset form fields
      setFormData({
        name: "",
        email: "",
        contact: "",
        designation: "",
      });
    } catch (err) {
      console.error("Demo request failed:", err);
      setStatus({
        success: false,
        message:
          err?.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "⏱️ Request timed out. Please try again."
            : "❌ Submission failed. Please try again later."),
      });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
     💅 Render UI
  ----------------------------------------------------- */
  return (
    <div className="demo-page">
      <h2>Request a Demo</h2>

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

      <form onSubmit={handleSubmit} className="demo-form" noValidate>
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
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Company / Designation (Optional)"
          value={formData.designation}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Submitting..." : "Submit Demo Request"}
        </button>
      </form>
    </div>
  );
}
