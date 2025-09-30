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
  // Refresh tokens stored as hashed values to allow revoke/rotation
  refreshTokens: [
    {
      token: { type: String }, // sha256 of the refresh token
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date },
    },
  ],
  // Fields to support password reset flow
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Indexes for uniqueness and performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ enrollmentNo: 1 }, { unique: true, sparse: true });
userSchema.index({ employeeNo: 1 }, { unique: true, sparse: true });
userSchema.index({ hostelName: 1 });

export default mongoose.model("User", userSchema);
