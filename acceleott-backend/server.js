import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import nodemailer from "nodemailer";

import authRoutes from "./routes/auth.js";
import demoRoutes from "./routes/demoRoutes.js";

dotenv.config();
const app = express();

// ================================
// Middleware
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ================================
// Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/demo", demoRoutes); // ✅ Scoped route (was `/api` earlier)

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running successfully!");
});

// ================================
// Test Email Route (Admin Utility)
// ================================
app.post("/api/test-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: "❌ Missing email fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
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
    res.status(500).json({ message: "Failed to send email." });
  }
});

// ================================
// MongoDB + Server Start
// ================================
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acceleottDB";

mongoose.connect(MONGO_URI)

  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });
