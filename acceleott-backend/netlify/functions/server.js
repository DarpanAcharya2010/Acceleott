import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "../../routes/auth.js";
import demoRoutes from "../../routes/demoRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

app.get("/", (req, res) => res.send("✅ Netlify Server is Running!"));

// Export handler
export const handler = serverless(app);
