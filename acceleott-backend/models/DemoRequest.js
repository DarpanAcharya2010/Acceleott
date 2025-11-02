import mongoose from "mongoose";

/**
 * 🧠 Demo Request Schema
 * Stores information submitted through the “Book Demo” form.
 * Includes validation, indexing, and performance optimizations.
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
        validator: (v) => /^\+?\d{10,15}$/.test(v), // ✅ Supports +91, etc.
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

// ✅ Optimize frequent lookups
DemoRequestSchema.index({ email: 1, contact: 1 });

// ✅ Virtual for formatted createdAt (for dashboards/logs)
DemoRequestSchema.virtual("requestedOn").get(function () {
  return this.createdAt ? this.createdAt.toLocaleString() : "N/A";
});

/* ==========================================================
   🧩 Prevent model overwrite (for hot reload / Netlify cold starts)
   ========================================================== */
const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model("DemoRequest", DemoRequestSchema);

export default DemoRequest;
