import React from "react";
import { useNavigate } from "react-router-dom";
import "./aimmed.css";

export default function AIMMEDPage() {
  const navigate = useNavigate();

  // Redirect user to demo request form page
  const handleBookDemo = () => {
    navigate("/demo");
  };

  return (
    <section className="aimmed-section">
      {/* Ribbons */}
      <div className="ribbons aimmed-ribbons">
        <div className="ribbon ribbon-1"></div>
        <div className="ribbon ribbon-2"></div>
        <div className="ribbon ribbon-3"></div>
      </div>

      <div className="aimmed-container">
        <div className="aimmed-left">
          <h1 className="aimmed-title">AIMMED — From Manual to Magical</h1>
          <p className="aimmed-subtext">
            AIMMED is a comprehensive, AI-driven platform designed to help doctors and clinics efficiently manage patient
            relationships from first contact to long-term care. It centralizes communications, appointments, and case
            histories while surfacing actionable insights that enhance care quality and operational efficiency.
          </p>
          <p>
            Beyond basic CRM, AIMMED automates follow-ups, reminders, and education loops tailored to each patient’s
            journey. Smart workflows adapt to your specialty, ensuring consistent, compliant engagement at scale.
          </p>
          <p>
            Built for reliability and growth, AIMMED integrates with leading EHRs and marketing tools to create a
            seamless ecosystem around your practice.
          </p>

          {/* Redirect to DemoRequestPage */}
          <button className="aimmed-btn" onClick={handleBookDemo}>
            Book a Demo
          </button>
        </div>

        <div className="aimmed-right">
          <img
            src="/images/aimmed-dashboard.jpg"
            alt="AIMMED dashboard preview"
            className="aimmed-image"
          />
          <img
            src="/images/aimmed-dashboard-2.jpg"
            alt="AIMMED mobile dashboard"
            className="aimmed-image secondary-image"
          />
        </div>
      </div>
    </section>
  );
}
