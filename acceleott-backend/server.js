/**acceleott-backend/server.js
 * ============================================================
 *  Acceleott Serverless Backend (Netlify Function Entry)
 * ============================================================
 */

import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// 🔹 Load env vars
dotenv.config();

// =====================================================
// 🔹 Import routes
// =====================================================
import authRoutes from "./routes/auth.js";
import demoRoutes from "./routes/demoRoutes.js";
import contactRoutes from "./routes/contact.js";

const app = express();

// =====================================================
// 1️⃣ Middleware
// =====================================================
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: [FRONTEND_URL, "https://fabulous-llama-4c57d9.netlify.app"],
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
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// =====================================================
// 3️⃣ Routes
// =====================================================

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend API is running via Netlify Functions!" });
});

// ✅ Correct mount paths for Netlify Functions
app.use("/api/demo", demoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);



// =====================================================
// 4️⃣ 404 Handler (Catch unmatched)
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
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
  });
}

export default app;
