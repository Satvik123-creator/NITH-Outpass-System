import express from "express";
import { signup, login,sendOtp, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

// Signup for both student and warden
router.post("/signup", signup);

// Login for both student and warden
router.post("/login", login);

// POST /api/otp/send
router.post("/send-otp", sendOtp);

// POST /api/otp/verify
router.post("/verify-otp", verifyOtp);

export default router;
