/**
 * ==========================================
 * 📬 Contact Routes (Serverless Compatible)
 * ==========================================
 * Handles POST /api/contact
 * Works seamlessly in both Express (local dev)
 * and Netlify serverless environments.
 */

import express from "express";
import { sendMessage } from "../controllers/contactController.js";

const router = express.Router();

/* ==========================================================
   📨 POST /api/contact — handle contact form submissions
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    await sendMessage(req, res);
  } catch (err) {
    console.error("❌ Contact route error:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Failed to process contact request. Please try again.",
    });
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
