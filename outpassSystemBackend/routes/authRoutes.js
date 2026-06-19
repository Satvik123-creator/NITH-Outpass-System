import express from "express";
import {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  signupValidator,
  loginValidator,
  otpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/requestValidators.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Signup for both student and warden
router.post("/signup", signupValidator, validateRequest, signup);

// Login for both student and warden (rate limited)
router.post("/login", authLimiter, loginValidator, validateRequest, login);

// POST /api/otp/send (no limiter)
router.post("/send-otp", otpValidator, validateRequest, sendOtp);

// POST /api/otp/verify
router.post("/verify-otp", otpValidator, validateRequest, verifyOtp);

// POST /auth/forgot-password (rate limited)
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  validateRequest,
  forgotPassword
);

// POST /auth/reset-password
router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  resetPassword
);

// Update profile (protected)
router.patch("/me", protect, updateProfile);

import { refreshToken, logout } from "../controllers/authController.js";

// Refresh access token

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// (debug routes removed to keep controller minimal)

export default router;
