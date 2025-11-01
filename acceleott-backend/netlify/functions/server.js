/**
 * ============================================================
 *  Acceleott Serverless Backend (Netlify Function Entry)
 * ============================================================
 * ✅ Works locally (netlify dev)
 * ✅ Works on deployed Netlify
 * ✅ MongoDB + Auth + Demo + Contact routes
 * ============================================================
 */

import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

// ✅ Import routes (go up TWO levels)
import authRoutes from "../../routes/auth.js";
import demoRoutes from "../../routes/demoRoutes.js";
import contactRoutes from "../../routes/contact.js";

const app = express();

// =====================================================
// 1️⃣ Middleware
// =====================================================
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

// =====================================================
// 2️⃣ MongoDB Connection
// =====================================================
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables.");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) =>
      console.error("❌ MongoDB connection failed:", err.message)
    );
}

// =====================================================
// 3️⃣ Routes
// =====================================================

// ✅ Health check route (this one should now work)
app.get("/api", (req, res) => {
  res.json({ message: "🚀 Backend API is running via Netlify Functions!" });
});

// ✅ Attach API routes (no Netlify prefix)
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/contact", contactRoutes);

// =====================================================
// 4️⃣ Error Handler
// =====================================================
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// =====================================================
// 5️⃣ Export for Netlify
// =====================================================
export const handler = serverless(app);

// =====================================================
// 6️⃣ Local Development
// =====================================================
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local API running at http://localhost:${PORT}`);
    console.log(`🌐 Allowed origin: ${FRONTEND_URL}`);
  });
}

export default app;
