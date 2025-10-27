import mongoose from "mongoose";

const DemoRequestSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      lowercase: true, 
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    contact: { 
      type: String, 
      required: [true, "Contact number is required"], 
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid contact number (must be 10 digits)"]
    },
    designation: { 
      type: String, 
      trim: true 
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    collection: "demoRequests",
  }
);

// Optional: Prevent multiple models being compiled in hot-reload dev environments
const DemoRequest =
  mongoose.models.DemoRequest || mongoose.model("DemoRequest", DemoRequestSchema);

export default DemoRequest;
