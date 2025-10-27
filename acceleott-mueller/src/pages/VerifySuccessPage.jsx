import React from "react";
import { Link } from "react-router-dom"; // if using react-router
import "./verifySuccess.css";

const VerifySuccessPage = () => {
  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-box">
          <h2>✅ Email Verified Successfully!</h2>
          <p>
            Thank you for verifying your email. You can now log in and access your account.
          </p>
          <Link to="/login" className="btn">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccessPage;
