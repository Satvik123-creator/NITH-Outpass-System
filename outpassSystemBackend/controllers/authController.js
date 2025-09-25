import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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
    const { enrollmentNo, employeeNo, password, role } = req.body;

    let user;

    if (role === "student") {
      user = await User.findOne({ enrollmentNo, role: "student" });
    } else if (role === "warden") {
      user = await User.findOne({ employeeNo, role: "warden" });
    } else {
      console.log("Login failed: invalid role", { role });
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      console.log("Login failed: user not found", {
        search: { enrollmentNo, employeeNo, role },
      });
      return res.status(400).json({ message: "User not found" });
    }

    // compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Login failed: invalid credentials for user", {
        userId: user._id,
        email: user.email,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
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

  // Nodemailer setup (Gmail example)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS port (works better if 465 is blocked)
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 16-character App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for NITH Outpass Portal",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
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
