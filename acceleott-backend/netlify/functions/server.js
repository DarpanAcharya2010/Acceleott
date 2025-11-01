// acceleott-backend/netlify-functions/server.js
import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "✅ Express backend is working on Netlify!" });
});

// Example API route
app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "John Doe" }]);
});

export const handler = serverless(app);
