import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  occupation: { type: String },
  source: { type: String },
  emailVerified: { type: Boolean, default: false },
  verifyToken: String,
  verifyTokenExpires: Date,
});

export default mongoose.model("User", userSchema);
