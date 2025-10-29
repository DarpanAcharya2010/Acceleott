import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./aimmed.css";

/**
 * AIMMEDPage – Product information and demo CTA section.
 * Optimized for production:
 * - Accessible image alt text
 * - Lazy-loaded images for performance
 * - Stable navigation callback (memoized)
 * - SEO-friendly structure
 */
export default function AIMMEDPage() {
  const navigate = useNavigate();

  // ✅ UseCallback ensures the function identity stays stable (avoids unnecessary re-renders)
  const handleBookDemo = useCallback(() => {
    navigate("/demo");
  }, [navigate]);

  return (
    <section className="aimmed-section" aria-labelledby="aimmed-title">
      {/* Background ribbons */}
      <div className="ribbons aimmed-ribbons" aria-hidden="true">
        <div className="ribbon ribbon-1" />
        <div className="ribbon ribbon-2" />
        <div className="ribbon ribbon-3" />
      </div>

      <div className="aimmed-container">
        {/* LEFT: Text content */}
        <div className="aimmed-left">
          <h1 id="aimmed-title" className="aimmed-title">
            AIMMED — From Manual to Magical
          </h1>

          <p className="aimmed-subtext">
            AIMMED is a comprehensive, AI-driven platform that helps doctors and clinics efficiently manage patient
            relationships—from first contact to long-term care. It centralizes communications, appointments, and case
            histories while surfacing actionable insights to enhance care quality and operational efficiency.
          </p>

          <p>
            Beyond a basic CRM, AIMMED automates follow-ups, reminders, and education loops tailored to each patient’s
            journey. Smart workflows adapt to your specialty, ensuring consistent and compliant engagement at scale.
          </p>

          <p>
            Built for reliability and growth, AIMMED integrates with leading EHRs and marketing tools to create a
            seamless, connected ecosystem for your practice.
          </p>

          {/* CTA Button */}
          <button
            type="button"
            className="aimmed-btn"
            onClick={handleBookDemo}
            aria-label="Book a demo for AIMMED"
          >
            Book a Demo
          </button>
        </div>

        {/* RIGHT: Product images */}
        <div className="aimmed-right">
          <img
            src="/images/aimmed-dashboard.jpg"
            alt="AIMMED desktop dashboard preview"
            className="aimmed-image"
            loading="lazy" // ✅ Performance: defer off-screen image loading
            decoding="async"
          />
          <img
            src="/images/aimmed-dashboard-2.jpg"
            alt="AIMMED mobile dashboard interface"
            className="aimmed-image secondary-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
