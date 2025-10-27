import React, { useState, useEffect } from "react";
import "./about.css";

export default function About() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport for auto-expansion on desktop
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= 760);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        {/* Section Heading */}
        <h2 className="heading" data-aos="fade-down">
          About Us
        </h2>

        {/* Short blurb always visible */}
        <p data-aos="fade-up">
          <strong>Acceleott</strong> is a visionary technology company founded by Raj Chaudhary and Darpan Acharya, built on the belief that innovation can accelerate growth across industries. We specialize in delivering powerful, user-centric solutions as services — transforming complex challenges into smart, scalable digital products.

At Acceleott, we're not just building software — we're crafting platforms that simplify lives and supercharge business performance. Our flagship products include:


        </p>
      </div>

      {/* Cards Section */}
      <div className="about-cards-wrapper">
        <div
          id="about-extra"
          className={`about-extra ${expanded || !isMobile ? "show" : "hide"}`}
        >
          <div className="about-cards">
            {/* AIMMED Card */}
            <div className="about-card animate-card" style={{ animationDelay: "0.1s" }}>
              <h3 className="accent">AIMMED</h3>
              <p>
                A comprehensive and intuitive <em>Doctor CRM &amp; Dashboard</em> designed to
                streamline patient management, appointments, and clinical workflows for modern practices.
              </p>
            </div>

            {/* MarketBoost Card */}
            <div className="about-card animate-card" style={{ animationDelay: "0.3s" }}>
              <h3 className="accent">MarketBoost</h3>
              <p>
                An <em>AI-powered marketing engine</em> that helps plan, launch, and track campaigns
                with clear analytics and practical insights for growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Extra Paragraphs */}
      <div className="container">
        {expanded || !isMobile ? (
          <>
            <p data-aos="fade-up" data-aos-delay="140">
              With a strong focus on design, functionality, and automation, Acceleott is committed to creating solutions that empower individuals and businesses to thrive in a connected world. We're proud to be driving innovation from our base in Gujarat, India — with a mission to take world-class products global.

Join us on this journey to accelerate what's next.
            </p>
            <p data-aos="fade-up" data-aos-delay="180">
              We’re proud to be driving innovation from Gujarat, India — crafting solutions that empower
              teams to work smarter and move faster.
            </p>
          </>
        ) : null}

        {/* Toggle button only shown on mobile */}
        {isMobile && (
          <button
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="about-extra"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </section>
  );
}
