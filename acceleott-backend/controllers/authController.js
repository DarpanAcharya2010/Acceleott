import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

/**
 * Nodemailer transporter (Gmail)
 * Make sure EMAIL_USER and EMAIL_PASS (App Password) are present in .env
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/** Small helper to build verification email HTML */
function buildVerificationEmail(name, verifyUrl) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;color:#0f172a">
    <h2>Welcome to Acceleott, ${name}!</h2>
    <p>Thanks for registering. Please confirm your email by clicking the button below.</p>
    <p style="margin:24px 0">
      <a href="${verifyUrl}" style="background:#0ea5a5;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600">
        Verify my email
      </a>
    </p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break:break-all">${verifyUrl}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <small>If you didn’t create an account, you can ignore this email.</small>
  </div>`;
}

/**
 * Register a new user, save hashed password, generate a verification token,
 * send verification email to the user and (optionally) notify admin.
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, occupation, source } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user record
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      phone,
      occupation,
      source,
      emailVerified: false,
    });

    // Create verification token (raw token sent to user, hashed stored in DB)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.verifyToken = hashedToken;
    user.verifyTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Build verification link:
    // FRONTEND should have a route that accepts the raw token and calls backend verify endpoint.
    // We send user to frontend route which will call backend GET /api/auth/verify/:token
    const frontendVerifyPath = `${process.env.FRONTEND_URL || process.env.APP_BASE_URL || "http://localhost:5173"}/verify/${rawToken}`;
    // But backend verify endpoint expects GET /api/auth/verify/:token — frontend handler calls it.
    // For direct-linking you could also point to backend verify route that redirects after verification:
    const backendDirectVerify = `${process.env.API_BASE_URL || process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/verify/${rawToken}`;

    // Send verification email to user (prefer backendDirectVerify or frontend flow based on your design)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: "Confirm your email — Acceleott",
        html: buildVerificationEmail(user.name, frontendVerifyPath),
      });
    } catch (mailErr) {
      // Log but don't fail registration - user can request resend
      console.error("Failed to send verification email:", mailErr);
    }

    // Optionally notify admin (if ADMIN_EMAIL is set) — non-blocking
    if (process.env.ADMIN_EMAIL) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New User Registered — ${user.name}`,
          html: `
            <p>New user has registered on Acceleott:</p>
            <ul>
              <li><strong>Name:</strong> ${user.name}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Registered at:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          `,
        });
      } catch (adminMailErr) {
        console.error("Failed to notify admin about new registration:", adminMailErr);
      }
    }

    return res.status(201).json({
      message: "User registered. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);

    // Handle duplicate key (unique email) gracefully
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already registered." });
    }

    return res.status(500).json({ message: "Server error during registration." });
  }
};

/**
 * Verify email endpoint — accepts raw token, hashes and looks up user.
 * On success marks emailVerified true and clears token fields.
 * Then redirects to frontend success page.
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).send("Invalid verification token.");

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verifyToken: hashed,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).send("Invalid or expired verification link.");

    user.emailVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    // Redirect to frontend success page (use FRONTEND_URL or APP_BASE_URL)
    const frontendSuccess = process.env.FRONTEND_URL || process.env.APP_BASE_URL || "http://localhost:5173";
    return res.redirect(`${frontendSuccess}/verify-success`);
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).send("Server error during verification.");
  }
};

/**
 * Resend verification email if user exists and is not verified.
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) return res.status(200).json({ message: "Email already verified" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.verifyTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const frontendVerifyPath = `${process.env.FRONTEND_URL || process.env.APP_BASE_URL || "http://localhost:5173"}/verify/${rawToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your email — Acceleott",
        html: buildVerificationEmail(user.name, frontendVerifyPath),
      });
    } catch (mailErr) {
      console.error("Failed to send verification email (resend):", mailErr);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login: validate credentials, ensure email verified, issue JWT in cookie
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email to continue." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Logout: clear token cookie
 */
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};

/**
 * Get current user from cookie token
 */
export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password -verifyToken -verifyTokenExpires");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
