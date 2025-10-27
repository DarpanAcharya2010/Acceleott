import express from "express";
import DemoRequest from "../models/DemoRequest.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., yourcompany@gmail.com
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT normal password)
  },
});

// --- POST /api/demo ---
// Save demo request to MongoDB and send admin notification
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, Designation } = req.body;

    // Basic validation
    if (!name || !email || !contact) {
      return res
        .status(400)
        .json({ message: "Name, email, and contact are required." });
    }

    // ✅ Save to MongoDB
    const demoRequest = await DemoRequest.create({
      name,
      email,
      contact,
      Designation,
    });

    // ✅ Send email notification
    await transporter.sendMail({
      from: `"Acceleott Automations" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // e.g., info@acceleott.com
      subject: `New Demo Request — ${name}`,
      html: `
        <h2>New Demo Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Company / Designation:</strong> ${Designation || "N/A"}</p>
        <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("✅ Demo request stored and email sent successfully.");

    res
      .status(201)
      .json({ message: "✅ Demo request submitted successfully!" });
  } catch (err) {
    console.error("❌ Demo Request Error:", err);
    res.status(500).json({
      message: "Server error while submitting demo request. Please try again.",
    });
  }
});

export default router;
