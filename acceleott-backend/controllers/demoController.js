import nodemailer from "nodemailer";
import DemoRequest from "../models/DemoRequest.js";

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., yourcompany@gmail.com
    pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
  },
});

// --- Book Demo Controller ---
export const bookDemo = async (req, res) => {
  try {
    const { name, email, contact, designation } = req.body;

    if (!name || !email || !contact) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // ✅ Save request to MongoDB
    const newRequest = await DemoRequest.create({
      name,
      email,
      contact,
      designation,
    });

    // ✅ Send email to the company/admin
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // e.g., "info@yourcompany.com"
      subject: `New AIMMED Demo Request from ${name}`,
      html: `
        <h2>New Demo Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Designation:</strong> ${designation || "N/A"}</p>
        <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "✅ Demo request submitted successfully! We'll contact you soon.",
      data: newRequest,
    });
  } catch (err) {
    console.error("Error booking demo:", err);
    res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
};
