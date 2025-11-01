/**
 * ============================================================
 *  Acceleott Backend API (Netlify Serverless Function)
 * ============================================================
 * ✅ Backend: acceleott-backend/
 * ✅ Frontend: acceleott-mueller/
 * ✅ Works with MongoDB + Express + Nodemailer on Netlify
 * ============================================================
 */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

// --- Import backend routes from acceleott-backend ---
import authRoutes from "../../acceleott-backend/routes/auth.js";
import demoRoutes from "../../acceleott-backend/routes/demoRoutes.js";

// ================================
// 1. Setup and Environment
// ================================
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const mongoURI = process.env.MONGODB_URI;

// ✅ Fix 1: Don’t crash function on missing Mongo URI — handle gracefully
if (!mongoURI) {
  console.error("❌ Missing MONGODB_URI. Add it in Netlify Environment Variables.");
} else {
  // ================================
  // 2. MongoDB Connection
  // ================================
  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
    });
}

// ================================
// 3. Express App Setup
// ================================
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ================================
// 4. API Routes
// ================================
app.get("/api", (req, res) => {
  res.json({ message: "✅ Acceleott API Root Working" });
});

app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

// --- Test Email Endpoint ---
app.post("/api/test-email", async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text)
    return res.status(400).json({ message: "❌ Missing email fields" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "✅ Test email sent successfully" });
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    res.status(500).json({ message: "Internal server error while sending email." });
  }
});

// ================================
// 5. Error Handling
// ================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error." });
});

// ================================
// 6. Export for Netlify
// ================================
export const handler = serverless(app);

// ✅ Local development mode (when running `netlify dev`)
if (NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local API running on http://localhost:${PORT}`);
  });
}
