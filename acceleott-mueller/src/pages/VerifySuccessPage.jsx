import React from "react";
import { Link } from "react-router-dom";
import "./verifySuccess.css";

export default function VerifySuccessPage() {
  return (
    <section className="verify-page">
      <div className="verify-container">
        <div className="verify-box fade-in">
          <h2 className="verify-title">✅ Email Verified Successfully!</h2>
          <p className="verify-message">
            Thank you for verifying your email. You can now log in and access your account securely.
          </p>
          <Link to="/login" className="btn verify-btn">
            Go to Login
          </Link>
        </div>
      </div>
    </section>
  );
}
