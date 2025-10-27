// backend/utils/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // can be Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,  // your Gmail or email
    pass: process.env.EMAIL_PASS,  // app password
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Acceleott Website" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
