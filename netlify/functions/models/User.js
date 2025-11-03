// netlify/functions/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * ===========================================================
 * 👤 User Schema (Optimized for Serverless)
 * -----------------------------------------------------------
 * - Bcrypt hashing
 * - Email verification tokens
 * - Cold start safety
 * - Strong validation
 * ===========================================================
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters."],
      select: false, // ⛔ Hide from queries
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid phone number (must be 10 digits)."],
    },

    occupation: {
      type: String,
      trim: true,
      maxlength: [100, "Occupation cannot exceed 100 characters."],
    },

    source: {
      type: String,
      trim: true,
      maxlength: [100, "Source field cannot exceed 100 characters."],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: {
      type: String,
      select: false,
    },

    verifyTokenExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

/* ===========================================================
   🔐 Hash Password Before Save
=========================================================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ===========================================================
   🔑 Compare Passwords
=========================================================== */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ===========================================================
   ⚡ Safe Model Initialization
=========================================================== */
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
