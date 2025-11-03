/**
 * ==========================================
 * 🔐 Auth Routes (Serverless + Local Compatible)
 * ==========================================
 * Handles registration, verification,
 * login, logout, and user profile retrieval.
 */

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();
const router = express.Router();

// ✅ Middleware
router.use(cookieParser());
router.use(express.json());

/* ==========================================
   ⚙️ MongoDB Connection
========================================== */
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected (Auth Routes)");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
})();

/* ==========================================
   🌍 CORS Handler for Netlify + Local
========================================== */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ==========================================
   ✉️ Nodemailer Setup
========================================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

if (process.env.NODE_ENV !== "production") {
  transporter.verify((err) => {
    if (err) console.error("❌ Email transporter error:", err.message);
    else console.log("📨 Email transporter ready.");
  });
}

/* ==========================================
   📩 Email Template
========================================== */
function buildVerificationEmail(name, verifyUrl) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;color:#0f172a">
    <h2>Welcome to Acceleott, ${name}!</h2>
    <p>Please confirm your email by clicking below:</p>
    <p style="margin:24px 0">
      <a href="${verifyUrl}" 
         style="background:#0ea5a5;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
         Verify My Email
      </a>
    </p>
    <p>If the button doesn’t work, copy this link:</p>
    <p style="word-break:break-all">${verifyUrl}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <small>If you didn’t create an account, ignore this email.</small>
  </div>`;
}

/* ==========================================
   🧾 Register User
========================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verifyToken = crypto.createHash("sha256").update(token).digest("hex");
    user.verifyTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // ✅ Base URL detection (for local & prod)
    const baseUrl =
      process.env.URL ||
      process.env.DEPLOY_URL ||
      "http://localhost:8888";

    const verifyUrl = `${baseUrl}/.netlify/functions/server/api/auth/verify/${token}`;

    // Send verification email
    await transporter.sendMail({
      from: `"Acceleott" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirm your email — Acceleott",
      html: buildVerificationEmail(name, verifyUrl),
    });

    // Optional admin alert
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"Acceleott" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🆕 New User Registered — ${name}`,
        html: `
          <h3>New User Registration</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
        `,
      });
    }

    // ✅ JWT for immediate login post-registration
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      token: jwtToken, // ✅ frontend needs this
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

/* ==========================================
   ✅ Verify Email
========================================== */
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpires: { $gt: Date.now() },
    });

    const appUrl =
      process.env.APP_BASE_URL ||
      process.env.URL ||
      "http://localhost:8888";

    if (!user) return res.redirect(`${appUrl}/verify-failed`);

    user.emailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.redirect(`${appUrl}/verify-success`);
  } catch (err) {
    console.error("❌ Verification Error:", err);
    res.redirect(`${process.env.APP_BASE_URL || "http://localhost:8888"}/verify-failed`);
  }
});

/* ==========================================
   🔐 Login User
========================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials." });

    if (!user.emailVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ return token explicitly (frontend uses this)
    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

/* ==========================================
   🚪 Logout
========================================== */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logged out successfully." });
});

/* ==========================================
   👤 Get Logged-in User
========================================== */
router.get("/me", async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1]; // ✅ Allow bearer tokens

    if (!token) return res.status(401).json({ message: "Not authorized." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ GetMe Error:", err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

/* ==========================================
   🚫 Unsupported Methods
========================================== */
router.all("/", (req, res) => {
  res.status(405).json({
    error: `Method ${req.method} not allowed on /api/auth`,
  });
});

export default router;
