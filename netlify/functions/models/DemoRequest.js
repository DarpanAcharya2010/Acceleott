import mongoose from "mongoose";

/**
 * 🧠 Demo Request Schema
 * -------------------------------------------
 * Stores user demo requests submitted via the
 * “Book Demo” form on the site.
 * Fully optimized for serverless environments
 * (e.g., Netlify Functions, Vercel).
 */

const DemoRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
      index: true,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required."],
      validate: {
        validator: (v) => /^\+?\d{10,15}$/.test(v),
        message:
          "Invalid contact number. Must be 10–15 digits (optionally starting with +).",
      },
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters."],
      default: "N/A",
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt & updatedAt
    collection: "demoRequests",
    versionKey: false, // ✅ Removes __v field
  }
);

/* ==========================================================
   ⚡ Indexes & Virtuals
   ========================================================== */

// ✅ Optimize lookups by email & contact
DemoRequestSchema.index({ email: 1, contact: 1 });

// ✅ Virtual field for formatted date
DemoRequestSchema.virtual("requestedOn").get(function () {
  return this.createdAt ? this.createdAt.toLocaleString() : "N/A";
});

/* ==========================================================
   🧩 Safe Model Initialization (Serverless-Friendly)
   ========================================================== */
// Prevent model overwrite errors during Netlify cold starts / hot reloads
const DemoRequest =
  mongoose.models?.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);

/* ==========================================================
   🚀 Export
   ========================================================== */
export default DemoRequest;
