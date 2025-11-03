// netlify/functions/server.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8888",
      "https://fabulous-llama-4c57d9.netlify.app",
      "https://fabulous-llama-4c57d9.netlify.app/.netlify/functions/server/api/demo",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB Connection (optimized for serverless cold starts)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "acceleott",
    });
    isConnected = true;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};
connectDB();

/* ==========================================================
   ✅ Import and Mount Routes
   (Each file inside netlify/functions/routes/)
   ========================================================== */
import demoRoutes from "./routes/demoRoutes.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";

// ✅ Mount all routes under `/api`
app.use("/api/demo", demoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

/* ==========================================================
   ✅ Root Route for Testing
   ========================================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "✅ Netlify serverless Express API running successfully!",
  });
});

/* ==========================================================
   🚫 Catch-All Route for Undefined Paths
   ========================================================== */
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

/* ==========================================================
   ✅ Export for Netlify Handler
   ========================================================== */
export const handler = serverless(app);
