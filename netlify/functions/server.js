/**
 * ============================================================
 *  Acceleott Serverless Backend (Netlify Function Entry)
 * ============================================================
 * ✅ Works for Local + Netlify Production
 * ✅ Handles: Auth, Demo, Contact APIs
 * ✅ MongoDB + CORS + CookieParser
 * ✅ Fixed route prefix for Netlify Functions
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
const isNetlify = process.env.NETLIFY === "true";

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "https://fabulous-llama-4c57d9.netlify.app", // your main frontend
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
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) =>
      console.error("❌ MongoDB connection failed:", err.message)
    );
}

/* ============================================================
   🔹 Routes
   ✅ Base path fix for Netlify Functions
============================================================ */
const basePath = isNetlify ? "/.netlify/functions/server" : "";

// Health check routes
app.get(`${basePath}/`, (req, res) => {
  res.status(200).json({ message: "🚀 Acceleott backend is live!" });
});
app.get(`${basePath}/test`, (req, res) => {
  res.status(200).json({ message: "✅ API working on Netlify" });
});

// ✅ API Routes
app.use(`${basePath}/api/auth`, authRoutes);
app.use(`${basePath}/api/demo`, demoRoutes);
app.use(`${basePath}/api/contact`, contactRoutes);

// ✅ Local Dev Fallback (no basePath)
if (!isNetlify) {
  app.use("/api/auth", authRoutes);
  app.use("/api/demo", demoRoutes);
  app.use("/api/contact", contactRoutes);
}

/* ============================================================
   🔹 Error Handling
============================================================ */
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ============================================================
   🔹 Export for Netlify (serverless)
============================================================ */
export const handler = serverless(app);

/* ============================================================
   🔹 Local Dev Mode (optional)
   Run manually: node netlify/functions/server.js
============================================================ */
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local API running at http://localhost:${PORT}`);
    console.log(`🌐 Allowed origin: ${FRONTEND_URL}`);
  });
}

export default app;
