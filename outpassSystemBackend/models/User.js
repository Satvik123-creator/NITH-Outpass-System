import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNo: { type: String, unique: true, sparse: true }, // only students need this
  employeeNo: { type: String, unique: true, sparse: true }, // only wardens need this
  hostelName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "warden"], required: true },
  // Brute-force protection fields
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  // Fields to support password reset flow
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model("User", userSchema);
