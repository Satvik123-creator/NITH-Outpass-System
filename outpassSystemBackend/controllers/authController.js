import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import cryptoLib from "crypto";
import User from "../models/User.js";
// ================= Signup =================
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      enrollmentNo,
      employeeNo,
      hostelName,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (role === "student" && !enrollmentNo) {
      return res
        .status(400)
        .json({ message: "enrollmentNo is required for students" });
    }
    if (role === "warden" && !employeeNo) {
      return res
        .status(400)
        .json({ message: "employeeNo is required for wardens" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // Build user object without setting fields to null explicitly.
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "student" && enrollmentNo)
      userData.enrollmentNo = enrollmentNo;
    if (role === "warden" && employeeNo) userData.employeeNo = employeeNo;
    if (hostelName) userData.hostelName = hostelName;

    const user = new User(userData);
    await user.save();

    // generate token for immediate auth like login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // sanitize user before sending (do not send hashed password)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollmentNo: user.enrollmentNo,
      employeeNo: user.employeeNo,
      hostelName: user.hostelName,
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= Login =================
export const login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    // Accept either enrollment or enrollmentNo from client and normalize
    let { enrollmentNo, employeeNo, password, role } = req.body;
    // fallback for different frontend field names
    if (!enrollmentNo && req.body.enrollment)
      enrollmentNo = req.body.enrollment;

    // normalize
    if (enrollmentNo && typeof enrollmentNo === "string") {
      enrollmentNo = enrollmentNo.trim().toUpperCase();
    }
    if (employeeNo && typeof employeeNo === "string") {
      employeeNo = employeeNo.trim().toUpperCase();
    }

    // infer role if not provided
    if (!role) {
      if (enrollmentNo) role = "student";
      else if (employeeNo) role = "warden";
    }

    let user;

    if (role === "student") {
      console.log("Looking up student by enrollmentNo", { enrollmentNo });
      user = await User.findOne({ enrollmentNo, role: "student" });
    } else if (role === "warden") {
      console.log("Looking up warden by employeeNo", { employeeNo });
      user = await User.findOne({ employeeNo, role: "warden" });
    } else {
      console.log("Login failed: invalid or missing role", {
        role,
        enrollmentNo,
        employeeNo,
      });
      return res
        .status(400)
        .json({ message: "Invalid role or missing credentials" });
    }

    if (!user) {
      console.log("Login failed: user not found", {
        search: { enrollmentNo, employeeNo, role },
      });
      return res.status(400).json({ message: "User not found" });
    }

    // check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({
        message: `Account locked. Try again in ${waitSeconds} seconds`,
      });
    }

    // compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      const MAX_FAILED = 5;
      const LOCK_MINUTES = 15;
      if (user.failedLoginAttempts >= MAX_FAILED) {
        user.lockUntil = Date.now() + LOCK_MINUTES * 60 * 1000; // lock for 15 minutes
        console.log(
          `User ${user.email} locked until ${new Date(user.lockUntil)}`
        );
      }
      await user.save();
      console.log("Login failed: invalid credentials for user", {
        userId: user._id,
        email: user.email,
        failedLoginAttempts: user.failedLoginAttempts,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // reset failed login counters on successful login
    if (user.failedLoginAttempts && user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    // generate short-lived access token and refresh token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
    );

    // create refresh token (secure random) and store hashed version
    const refreshTokenPlain = cryptoLib.randomBytes(64).toString("hex");
    const refreshTokenHash = cryptoLib
      .createHash("sha256")
      .update(refreshTokenPlain)
      .digest("hex");
    const refreshExpiresDays = Number(process.env.REFRESH_TOKEN_DAYS) || 30;
    const refreshExpiresAt =
      Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000;

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push({
      token: refreshTokenHash,
      expiresAt: refreshExpiresAt,
    });
    // keep only last 10 tokens
    if (user.refreshTokens.length > 10) user.refreshTokens.shift();
    await user.save();

    // Set HttpOnly cookie for refresh token (secure flag depends on env)
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshTokenPlain, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      expires: new Date(refreshExpiresAt),
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentNo: user.enrollmentNo,
        employeeNo: user.employeeNo,
        hostelName: user.hostelName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh token endpoint - rotates refresh token
export const refreshToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!tokenFromCookie)
      return res.status(401).json({ message: "No refresh token" });

    const tokenHash = cryptoLib
      .createHash("sha256")
      .update(tokenFromCookie)
      .digest("hex");
    const user = await User.findOne({ "refreshTokens.token": tokenHash });
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    // find the stored token entry
    const stored = user.refreshTokens.find((r) => r.token === tokenHash);
    if (!stored || stored.expiresAt < Date.now()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // rotate: remove used token and issue a new one
    user.refreshTokens = user.refreshTokens.filter(
      (r) => r.token !== tokenHash
    );
    const newRefreshPlain = cryptoLib.randomBytes(64).toString("hex");
    const newRefreshHash = cryptoLib
      .createHash("sha256")
      .update(newRefreshPlain)
      .digest("hex");
    const refreshExpiresDays = Number(process.env.REFRESH_TOKEN_DAYS) || 30;
    const newExpiresAt = Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000;
    user.refreshTokens.push({ token: newRefreshHash, expiresAt: newExpiresAt });
    if (user.refreshTokens.length > 10) user.refreshTokens.shift();
    await user.save();

    // issue new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
    );

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", newRefreshPlain, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      expires: new Date(newExpiresAt),
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout - revoke the refresh token
export const logout = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken || req.body?.refreshToken;
    if (tokenFromCookie) {
      const tokenHash = cryptoLib
        .createHash("sha256")
        .update(tokenFromCookie)
        .digest("hex");
      const user = await User.findOne({ "refreshTokens.token": tokenHash });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (r) => r.token !== tokenHash
        );
        await user.save();
      }
    }
    // clear cookie
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Store OTP temporarily (in production, use DB with expiration)
let otpStore = {};

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  // Save OTP
  otpStore[email] = otp;
  console.log("OTP generated for", email, ":", otp);

  // Nodemailer setup (configurable via env)
  const mailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const mailPort = process.env.EMAIL_PORT
    ? Number(process.env.EMAIL_PORT)
    : 587;
  const mailSecure = process.env.EMAIL_SECURE === "true" || mailPort === 465;

  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailSecure,
    auth: process.env.EMAIL_USER
      ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      : undefined,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || `no-reply@${mailHost}`,
    to: email,
    subject: "OTP for NITH Outpass Portal",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  // If dev fallback is enabled, return OTP in response instead of sending email
  if (process.env.DEV_EMAIL_FALLBACK === "true") {
    console.log("DEV_EMAIL_FALLBACK enabled - returning OTP in response");
    return res.status(200).json({ message: "OTP (dev)", otp });
  }

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Failed to send OTP: ", err);
    // If fallback enabled, return OTP for local testing
    if (process.env.DEV_EMAIL_FALLBACK === "true") {
      return res.status(200).json({ message: "OTP (dev)", otp });
    }
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = (req, res) => {
  console.log(req.body);
  const { email, otp } = req.body;
  console.log("Stored OTP:", otpStore[email], "Received OTP:", otp);

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email]; // remove OTP after verification
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

// Forgot password - send reset link
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // create token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const mailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const mailPort = process.env.EMAIL_PORT
      ? Number(process.env.EMAIL_PORT)
      : 587;
    const mailSecure = process.env.EMAIL_SECURE === "true" || mailPort === 465;

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecure,
      auth: process.env.EMAIL_USER
        ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        : undefined,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || `no-reply@${mailHost}`,
      to: email,
      subject: "Password Reset - NITH Outpass Portal",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl} \nThis link is valid for 1 hour.`,
    };

    // If dev fallback is enabled, return resetUrl in response for testing
    if (process.env.DEV_EMAIL_FALLBACK === "true") {
      console.log(
        "DEV_EMAIL_FALLBACK enabled - returning reset URL in response"
      );
      return res.json({ message: "Password reset (dev)", resetUrl });
    }

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    console.error("Password reset send failed:", err);
    if (process.env.DEV_EMAIL_FALLBACK === "true") {
      return res.json({ message: "Password reset (dev)", resetUrl });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password using token
export const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
