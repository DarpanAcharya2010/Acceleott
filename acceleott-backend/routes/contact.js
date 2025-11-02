/**
 * ==========================================
 * 📬 Contact Routes
 * ==========================================
 * Handles contact form submissions (POST /api/contact)
 * Delegates logic to controller for cleaner structure.
 * Works both in local Express and Netlify serverless environments.
 */

import express from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = express.Router();

/* ==========================================================
   📨 POST /api/contact — handle contact form submissions
   ========================================================== */
router.post("/", async (req, res, next) => {
  try {
    await sendMessage(req, res);
  } catch (err) {
    console.error("❌ Contact route error:", err.message || err);
    res
      .status(500)
      .json({ message: "Failed to process contact request. Please try again." });
  }
});

/* ==========================================================
   🚫 Handle unsupported HTTP methods
   ========================================================== */
router.all("/", (req, res) => {
  res.status(405).json({
    error: `Method ${req.method} not allowed on /api/contact`,
  });
});

export default router;
