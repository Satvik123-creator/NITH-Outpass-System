import express from "express";
import {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  signupValidator,
  loginValidator,
  otpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/requestValidators.js";

const router = express.Router();

// Signup for both student and warden
router.post("/signup", signupValidator, validateRequest, signup);

// Login for both student and warden
router.post("/login", loginValidator, validateRequest, login);

// POST /api/otp/send
router.post("/send-otp", otpValidator, validateRequest, sendOtp);

// POST /api/otp/verify
router.post("/verify-otp", otpValidator, validateRequest, verifyOtp);

// POST /auth/forgot-password
router.post(
  "/forgot-password",
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

export default router;
