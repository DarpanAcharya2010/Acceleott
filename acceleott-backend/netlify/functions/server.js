/**
 * ============================================================
 *  Acceleott Serverless Backend (Netlify Function Entry)
 * ============================================================
 * ✅ Wraps Express app for Netlify
 * ✅ Connects to MongoDB Atlas
 * ✅ Handles Auth + Demo routes
 * ✅ Works in both local + deployed environments
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

// --- Import Routes ---
import authRoutes from "../../routes/auth.js";
import demoRoutes from "../../routes/demoRoutes.js";

// ================================
// 1️⃣ Environment + Setup
// ================================
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || "production";
const isProduction = NODE_ENV === "production";

const app = express();

// --- Path utilities (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================================
// 2️⃣ MongoDB Connection
// ================================
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI missing — please set it in Netlify environment variables.");
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
// 3️⃣ Middleware
// ================================
const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  (isProduction ? "https://acceleott.netlify.app" : "http://localhost:5173");

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
// 4️⃣ Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

// ✅ Test email route
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
// 5️⃣ Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error." });
});

// ================================
// 6️⃣ Export for Netlify Function
// ================================
export const handler = serverless(app);

// ================================
// 7️⃣ Local Development Support
// ================================
if (NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local API running at http://localhost:${PORT}`);
    console.log(`🌐 Allowed origin: ${FRONTEND_URL}`);
  });
}

export default app;
