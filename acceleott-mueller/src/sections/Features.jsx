import React, { useEffect } from "react";
import "./features.css";

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5FA8D3"/>
          <stop offset="100%" stop-color="#F5E6CC"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#g)"/>
      <g fill="#0b1220" opacity="0.45" font-family="Inter, Arial" font-size="64" text-anchor="middle">
        <text x="800" y="520">Image</text>
      </g>
    </svg>`
  );

const ALL_ITEMS = [
  {
    title: "Clean, Clinic-Ready UX",
    body: "Acceleott provides a clean, clinic-ready UX designed for doctors and staff, ensuring that patient records, appointments, and key actions are easily accessible. Its intuitive layout reduces the learning curve and delivers a smooth, responsive experience across desktops, tablets, and mobile devices.",
    img: "/images/features/ux.jpg",
  },
  {
    title: "Reliable Data Handling",
    body: "With reliable data handling, Acceleott securely stores patient information, appointment histories, and medical records using encryption and automatic backups. Real-time syncing ensures that all staff have access to accurate, up-to-date data at all times.",
    img: "/images/features/data.jpg",
  },
  {
    title: "Centralised Information",
    body: "By centralising information, Acceleott brings together patient records, lab results, and prescription histories in one place. This eliminates scattered spreadsheets and siloed tools, enabling quick search, retrieval, and comprehensive patient insights.",
    img: "/images/features/collab.jpg",
  },
  {
    title: "Effortless Sharing",
    body: "Acceleott enables effortless sharing of reports, prescriptions, and lab results with colleagues and patients. Multiple formats like PDF, email, or internal messaging are supported, while permission controls ensure sensitive data is shared securely with the right people.",
    img: "/images/features/sharing.jpg",
  },
  {
    title: "Analytics Dashboard",
    body: "The analytics dashboard provides powerful visualizations of patient trends, appointment loads, and clinic performance. Customizable charts and graphs allow for actionable insights, helping clinics plan proactively, identify bottlenecks, and improve operational efficiency.",
    img: "/images/features/security.jpg",
  },
];

export default function Features() {
  // Scroll-based animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedEls = document.querySelectorAll(".reveal");
    animatedEls.forEach((el) => observer.observe(el));

    return () => {
      animatedEls.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2 className="title reveal fade-down">Key Features</h2>
        <p className="subtitle reveal fade-in">Built for clarity, trust, and momentum.</p>

        <div className="feature-list stagger reveal fade-up">
          {ALL_ITEMS.slice(0, 8).map((f, i) => (
            <article
              className="feature-item reveal fade-in"
              key={`${f.title}-${i}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="feature-content">
                <h3>
                  {f.icon && <span aria-hidden="true" style={{ marginRight: 8 }}>{f.icon}</span>}
                  {f.title}
                </h3>
                <p>{f.body}</p>
              </div>

              {f.img && (
                <div className="feature-media" style={{ aspectRatio: "16 / 10" }}>
                  <img
                    src={f.img}
                    alt={f.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
