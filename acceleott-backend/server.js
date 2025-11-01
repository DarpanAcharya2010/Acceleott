/**
 * ============================================================
 *  Acceleott Backend (Unified Local + Netlify Deployment)
 * ============================================================
 * ✅ Works locally (localhost:5000) and on Netlify Functions
 * ✅ Connects to MongoDB Atlas
 * ✅ Handles Auth + Demo routes + Email test
 * ✅ Optional: serves built React frontend in production
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
import serverless from "serverless-http";

// --- Import Routes ---
import authRoutes from "../../routes/auth.js";
import demoRoutes from "../../routes/demoRoutes.js";
import contactRoutes from "../../routes/contact.js";


// ================================
// 1. Environment Setup
// ================================
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const app = express();

// --- Path setup (for frontend serving)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FE_DIST_PATH = path.join(__dirname, "..", "acceleott-mueller", "dist");

// ================================
// 2. MongoDB Connection
// ================================
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================================
// 3. Middleware
// ================================
const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  (isProduction
    ? "https://acceleott.netlify.app"
    : "http://localhost:5173");

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
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/contact", contactRoutes )
// --- Test Email Route ---
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
// 5. Serve Frontend (Production Only)
// ================================
if (isProduction) {
  app.use(express.static(FE_DIST_PATH));

  // Serve React build for all unknown routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(FE_DIST_PATH, "index.html"));
  });
}

// ================================
// 6. Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error." });
});

// ================================
// 7. Deployment Exports
// ================================
console.log("🚀 Serverless function initialized successfully.");

// ✅ Netlify handler (functions)
export const handler = serverless(app);

// ✅ Local server
if (NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Allowed frontend origin: ${FRONTEND_URL}`);
  });
}
