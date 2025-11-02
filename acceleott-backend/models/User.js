import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * ===========================================================
 * 👤 User Schema (Production-Ready)
 * - Strong validation
 * - Password hashing
 * - Token-based verification support
 * - Optimized for Netlify/Serverless cold starts
 * ===========================================================
 */
const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      select: false, // ⛔ Don’t expose password in queries
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
    timestamps: true, // adds createdAt and updatedAt
    collection: "users",
    versionKey: false,
  }
);

/* ===========================================================
   🔐 Password Hash Middleware (Runs before saving)
   Only hashes if password is new or modified
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
   🔑 Compare Entered Password vs Hashed
=========================================================== */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ===========================================================
   🧠 Avoid Model Overwrite in Serverless
   (Netlify, Vercel, etc.)
=========================================================== */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
