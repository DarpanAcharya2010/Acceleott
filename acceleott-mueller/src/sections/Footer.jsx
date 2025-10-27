import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand + tagline */}
          <div className="col">
            <h3 className="brand">Acceleott</h3>
            <p>
              Accelerating innovation with AI-powered solutions for healthcare
              and marketing.
            </p>
            <div className="contact-row">
              📍 <span>Palanpur, Gujarat, India</span>
            </div>
          </div>

          {/* Raj Chaudhary */}
          <div className="col">
            <h4>Raj Chaudhary</h4>
            <div className="contact-row">
              📞 <a href="tel:+918369704331">+91 8369704331</a>
            </div>
            <div className="contact-row">
              ✉️{" "}
              <a href="mailto:rajchaudhary@acceleott.com">
                rajchaudhary@acceleott.com
              </a>
            </div>
          </div>

          {/* Darpan Acharya */}
          <div className="col">
            <h4>Darpan Acharya</h4>
            <div className="contact-row">
              📞 <a href="tel:+919016765380">+91 9016765380</a>
            </div>
            <div className="contact-row">
              ✉️{" "}
              <a href="mailto:darpan.pushkarna@acceleott.com">
                darpan.pushkarna@acceleott.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col">
            <h4>Quick Links</h4>
            <a href="#features">Features</a>
            <a href="#about">About Us</a>
            <a href="#blogs">Blogs</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2025 Acceleott. Crafted with <span className="heart">♥</span> in
          India.
        </span>
      </div>
    </footer>
  );
}
