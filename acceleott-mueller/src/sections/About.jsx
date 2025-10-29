import React, { useState, useEffect } from "react";
import "./about.css";

export default function About() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

  // ✅ Debounced viewport size detection
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth <= 760);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      <div className="container">
        {/* Section Heading */}
        <h2 id="about-heading" className="heading" data-aos="fade-down">
          About Us
        </h2>

        {/* Introduction */}
        <p data-aos="fade-up">
          <strong>Acceleott</strong> is a visionary technology company founded by{" "}
          <strong>Raj Chaudhary</strong> and <strong>Darpan Acharya</strong>,
          built on the belief that innovation accelerates growth across industries.{" "}
          We specialize in delivering powerful, user-centric solutions — transforming
          complex challenges into smart, scalable digital products.
        </p>

        <p data-aos="fade-up" data-aos-delay="100">
          At Acceleott, we’re not just building software — we’re crafting
          platforms that simplify lives and supercharge business performance.
          Our flagship products include:
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
            <div
              className="about-card animate-card"
              style={{ animationDelay: "0.1s" }}
              data-aos="fade-up"
            >
              <h3 className="accent">AIMMED</h3>
              <p>
                A comprehensive and intuitive <em>Doctor CRM & Dashboard</em>{" "}
                designed to streamline patient management, appointments, and
                clinical workflows for modern practices.
              </p>
            </div>

            {/* MarketBoost Card */}
            <div
              className="about-card animate-card"
              style={{ animationDelay: "0.3s" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="accent">MarketBoost</h3>
              <p>
                An <em>AI-powered marketing engine</em> that helps plan, launch,
                and track campaigns with clear analytics and practical insights
                for growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="container">
        {(expanded || !isMobile) && (
          <>
            <p data-aos="fade-up" data-aos-delay="160">
              With a strong focus on design, functionality, and automation,
              <strong> Acceleott</strong> is committed to creating solutions that
              empower individuals and businesses to thrive in a connected world.
              We’re proud to be driving innovation from Gujarat, India — with a
              mission to take world-class products global.
            </p>
            <p data-aos="fade-up" data-aos-delay="200">
              Join us on this journey to <strong>accelerate what’s next</strong>.
            </p>
          </>
        )}

        {/* Toggle Button (Mobile Only) */}
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
