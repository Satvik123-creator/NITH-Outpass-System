import mongoose from "mongoose";

const outpassSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  roomNumber: { type: String },
  addressOnLeave: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Indexes to speed up common queries
outpassSchema.index({ student: 1, createdAt: -1 });
outpassSchema.index({ status: 1, createdAt: -1 });
outpassSchema.index({ createdAt: -1 });

export default mongoose.model("Outpass", outpassSchema);
