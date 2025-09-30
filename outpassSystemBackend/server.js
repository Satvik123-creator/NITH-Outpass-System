import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import wardenRoutes from "./routes/wardenRoutes.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// apply a general rate limiter to all requests
app.use(generalLimiter);
// Harden HTTP headers
app.use(helmet());
app.disable("x-powered-by");

// block unsafe / rarely used HTTP methods explicitly
const ALLOWED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
]);
app.use((req, res, next) => {
  if (!ALLOWED_METHODS.has(req.method)) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/outpass", studentRoutes); // New route for outpass
app.use("/api/outpasses", wardenRoutes); // New route for outpass
await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
