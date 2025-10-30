/**
 * ============================================================
 *  Acceleott Fullstack Server (Backend + Frontend on Vercel)
 * ============================================================
 *  ✅ Works seamlessly on Vercel (frontend + backend)
 *  ✅ Serves React build files automatically
 *  ✅ Connects to MongoDB Atlas in production
 *  ✅ Keeps all routes, nodemailer, and JWT logic intact
 * ============================================================
 */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

import authRoutes from "./routes/auth.js";
import demoRoutes from "./routes/demoRoutes.js";

// ================================
// Setup and Environment
// ================================
dotenv.config();
const isVercel = !!process.env.VERCEL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
const requiredEnvVars = ["MONGODB_URI", "EMAIL_USER", "EMAIL_PASS", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}. Check .env or Vercel settings.`);
}

// ================================
// Express App Setup
// ================================
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS for local development
if (!isVercel) {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
}

// ================================
// Backend Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

// Test email route
app.post("/api/test-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text)
      return res.status(400).json({ message: "❌ Missing email fields" });

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
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/acceleottDB";

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================================
// Serve Frontend (React/Vite)
// ================================
// ⚠️ IMPORTANT: adjust this to your actual frontend build folder
const frontendPath = path.join(__dirname, "../acceleott-mueller/dist");
app.use(express.static(frontendPath));

// Fallback route — serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).json({ message: "API route not found" });
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

// ================================
// Start Server (Local Only)
// ================================
const PORT = process.env.PORT || 5000;
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}

// ================================
// Graceful Shutdown
// ================================
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

export default app;
