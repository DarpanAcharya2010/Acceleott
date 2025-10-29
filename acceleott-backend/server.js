/**
 * ================================================
 *  Acceleott Backend Server (server.js)
 *  -----------------------------------------------
 *  Production-ready Express backend with:
 *  ✅ MongoDB (Mongoose)
 *  ✅ CORS + Cookie Parsing
 *  ✅ Nodemailer utility route
 *  ✅ Environment variable validation
 * ================================================
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

// Validate critical environment variables
const requiredEnvVars = ["MONGO_URI", "EMAIL_USER", "EMAIL_PASS", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.warn(
    `⚠️ Missing environment variables: ${missingVars.join(", ")}. Please verify your .env file.`
  );
}

// ================================
// Express App Setup
// ================================
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================================
// CORS Configuration
// ================================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ================================
// API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

// Root route (for uptime checks)
app.get("/", (req, res) => {
  res.send("🚀 Acceleott backend is running successfully!");
});

// ================================
// Admin Utility: Test Email Endpoint
// ================================
app.post("/api/test-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ message: "❌ Missing required email fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
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
// Database Connection & Server Start
// ================================
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acceleottDB";

mongoose
  .connect(MONGO_URI, {
    autoIndex: false, // Improve performance in production
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================================
// Graceful Shutdown Handling
// ================================
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
