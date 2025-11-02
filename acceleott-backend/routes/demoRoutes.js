/**
 * ==========================================
 * Demo Request Routes (/demo)
 * ==========================================
 * Saves demo requests to MongoDB and notifies admin via email.
 * ✅ Works locally and in Netlify serverless environments
 */

import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import DemoRequest from "../models/DemoRequest.js";

dotenv.config();
const router = express.Router();

/* ==========================================================
   ✉️ Nodemailer Transporter (Use Gmail App Password)
   ========================================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ==========================================================
   ✅ TEST ROUTE — GET /.netlify/functions/server/demo
   ========================================================== */
router.get("/", (req, res) => {
  console.log("✅ GET /demo hit successfully");
  res.json({
    success: true,
    message: "✅ Demo route active. Server is running fine!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================
   📩 POST ROUTE — Create a new Demo Request
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, designation } = req.body;

    console.log("📨 Incoming Demo Request:", req.body);

    // --- Validate required fields ---
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
      designation,
    });

    // --- Send admin notification ---
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await transporter.sendMail({
          from: `"Acceleott Automations" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          subject: `🧩 New Demo Request — ${name}`,
          html: `
            <div style="font-family:Inter,Arial,sans-serif;color:#0f172a">
              <h2>New Demo Request Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Contact:</strong> ${contact}</p>
              <p><strong>Designation:</strong> ${designation || "N/A"}</p>
              <p><strong>Received At:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `,
        });
        console.log("📧 Admin notified successfully via email");
      } catch (emailErr) {
        console.error("⚠️ Failed to send admin notification:", emailErr.message);
      }
    } else {
      console.warn("⚠️ ADMIN_EMAIL not configured — skipping email notification");
    }

    console.log("✅ Demo request stored in MongoDB");

    return res.status(201).json({
      success: true,
      message: "Demo request submitted successfully.",
      data: demoRequest,
    });
  } catch (err) {
    console.error("❌ Demo Request Error:", err.message || err);
    return res.status(500).json({
      success: false,
      message:
        "Server error while submitting the demo request. Please try again later.",
    });
  }
});

/* ==========================================================
   🚫 Catch-all for unsupported methods
   ========================================================== */
router.all("/", (req, res) => {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
});

export default router;
