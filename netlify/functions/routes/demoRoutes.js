/**
 * ==========================================
 * 🧩 Demo Request Routes — /demo
 * ==========================================
 * Handles incoming demo form submissions.
 * Saves requests in MongoDB and notifies admin via email.
 * ✅ Works seamlessly in both local Express & Netlify serverless environments.
 */

import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import DemoRequest from "../models/DemoRequest.js";

dotenv.config();
const router = express.Router();

/* ==========================================================
   ✉️ Nodemailer Transporter Setup
   (Use Gmail App Password or SMTP service credentials)
   ========================================================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ==========================================================
   🧪 GET /demo — Health Check (for testing)
   ========================================================== */
router.get("/", (req, res) => {
  console.log("✅ /demo endpoint hit successfully");
  return res.json({
    success: true,
    message: "Demo route active — server is running fine!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================
   📩 POST /demo — Handle Demo Requests
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, designation } = req.body;

    console.log("📨 Incoming Demo Request:", req.body);

    // --- Validate inputs ---
    if (!name?.trim() || !email?.trim() || !contact?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and contact are required fields.",
      });
    }

    // --- Save to MongoDB ---
    const demoRequest = await DemoRequest.create({
      name,
      email,
      contact,
      designation: designation || "N/A",
    });
    console.log("✅ Demo request stored in MongoDB:", demoRequest._id);

    // --- Prepare admin email ---
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;color:#0f172a">
          <h2>📬 New Demo Request</h2>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Contact:</strong> ${contact}</li>
            <li><strong>Designation:</strong> ${designation || "N/A"}</li>
          </ul>
          <p>🕒 Received: ${new Date().toLocaleString()}</p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Acceleott Automations" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          subject: `🧩 New Demo Request — ${name}`,
          html,
        });
        console.log("📧 Admin notified successfully");
      } catch (mailErr) {
        console.error("⚠️ Failed to send admin email:", mailErr.message);
      }
    } else {
      console.warn("⚠️ ADMIN_EMAIL not set — skipping email notification");
    }

    // --- Respond success ---
    return res.status(201).json({
      success: true,
      message: "Demo request submitted successfully.",
      data: demoRequest,
    });
  } catch (err) {
    console.error("❌ Demo Request Error:", err);
    return res.status(500).json({
      success: false,
      message:
        "Server error while submitting the demo request. Please try again later.",
    });
  }
});

/* ==========================================================
   🚫 Unsupported Methods
   ========================================================== */
router.all("/", (req, res) => {
  res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed on /demo`,
  });
});

export default router;
