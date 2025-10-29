/**
 * ============================================================
 *  Acceleott Backend Server (Hybrid Local + Vercel)
 * ============================================================
 *  ✅ Works both locally and in Vercel serverless runtime
 *  ✅ Auto-detects environment
 *  ✅ Uses MongoDB Atlas when deployed
 *  ✅ Keeps all routes and integrations untouched
 * ============================================================
 */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import nodemailer from "nodemailer";

import authRoutes from "./routes/auth.js";
import demoRoutes from "./routes/demoRoutes.js";

// ================================
// Environment Configuration
// ================================
dotenv.config();

// Auto-detect if running on Vercel
const isVercel = !!process.env.VERCEL;

// Validate environment variables
const requiredEnvVars = ["MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}. Check your .env or Vercel config.`);
}

// ================================
// Express App Setup
// ================================
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ================================
// Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

app.get("/", (req, res) => {
  res.send(`🚀 Acceleott backend is running in ${isVercel ? "Vercel (Production)" : "Local"} mode!`);
});

// ================================
// Test Email Route
// ================================
app.post("/api/test-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ message: "❌ Missing email fields" });
    }

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
    console.error("❌ Email sending failed:", err);
    res.status(500).json({ message: "Internal server error while sending email." });
  }
});

// ================================
// MongoDB Connection
// ================================
const MONGO_URI = isVercel
  ? process.env.MONGO_URI // Cloud (Atlas)
  : process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acceleottDB"; // Local fallback

mongoose
  .connect(MONGO_URI, {
    autoIndex: false,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================================
// Start Server (Local only)
// ================================
const PORT = process.env.PORT || 5000;
if (!isVercel) {
  app.listen(PORT, () => console.log(`🚀 Server running locally at http://localhost:${PORT}`));
}

// ================================
// Graceful Shutdown
// ================================
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

// Export app for Vercel
export default app;
