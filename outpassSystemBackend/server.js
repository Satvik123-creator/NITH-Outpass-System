import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import wardenRoutes from "./routes/wardenRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/outpass", studentRoutes); // New route for outpass
app.use("/api/outpasses", wardenRoutes); // New route for outpass
await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
