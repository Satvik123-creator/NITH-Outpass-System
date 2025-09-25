import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNo: { type: String, unique: true, sparse: true },   // only students need this
  employeeNo: { type: String, unique: true, sparse: true },     // only wardens need this
  hostelName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "warden"], required: true },
});


export default mongoose.model("User", userSchema);
