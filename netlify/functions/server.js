/**
 * ============================================================
 *  Acceleott Serverless Backend (Netlify Function Entry)
 * ============================================================
 * ✅ Works on Local + Netlify Production
 * ✅ Handles: Auth, Demo, Contact APIs
 * ✅ MongoDB + CORS + CookieParser
 * ============================================================
 */

import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

/* ============================================================
   🔹 Import Routes
============================================================ */
import authRoutes from "../../acceleott-backend/routes/auth.js";
import demoRoutes from "../../acceleott-backend/routes/demoRoutes.js";
import contactRoutes from "../../acceleott-backend/routes/contact.js";

/* ============================================================
   🔹 Initialize Express App
============================================================ */
const app = express();

/* ============================================================
   🔹 Middleware Setup
============================================================ */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      /\.netlify\.app$/, // allow all Netlify preview deploys
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

/* ============================================================
   🔹 MongoDB Connection
============================================================ */
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables");
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) =>
      console.error("❌ MongoDB connection failed:", err.message)
    );
}

/* ============================================================
   🔹 Routes
============================================================ */

// ✅ NO manual prefix needed — Netlify adds '/.netlify/functions/server'
app.get("/", (req, res) => res.json({ message: "🚀 Acceleott backend is live!" }));
app.get("/test", (req, res) => res.json({ message: "✅ API test route working!" }));

// ✅ Direct route mounts (no basePath)
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/contact", contactRoutes);

/* ============================================================
   🔹 Error Handling
============================================================ */
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ============================================================
   🔹 Export for Netlify (serverless)
============================================================ */
export const handler = serverless(app);
export default app;
