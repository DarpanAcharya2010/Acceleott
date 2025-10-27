import React, { useState } from "react";
import axios from "axios";
import "./demopage.css";

export default function DemoRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    Designation: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, message: "Submitting..." });

    try {
      const res = await axios.post("http://localhost:5000/api/demo", formData);

      setStatus({
        success: true,
        message: res?.data?.message || "✅ Demo request submitted!",
      });

      // Reset form
      setFormData({ name: "", email: "", contact: "", Designation: "" });
    } catch (err) {
      setStatus({
        success: false,
        message:
          err?.response?.data?.message ||
          "❌ Submission failed. Please try again later.",
      });
    }
  };

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
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="demo-form">
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
          name="Designation"
          placeholder="Company / Designation (Optional)"
          value={formData.Designation}
          onChange={handleChange}
        />
        <button type="submit">Submit Demo Request</button>
      </form>
    </div>
  );
}
