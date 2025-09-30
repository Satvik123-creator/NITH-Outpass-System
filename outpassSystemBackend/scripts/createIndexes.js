import dotenv from "dotenv";
import { connectDB } from "../lib/db.js";
import mongoose from "mongoose";

dotenv.config();

const create = async () => {
  await connectDB();

  try {
    // Ensure indexes for all models by opening model files
    // Require models so Mongoose registers them and their indexes
    await import("../models/User.js");
    await import("../models/Outpass.js");

    // Use Mongoose to sync indexes
    for (const name of Object.keys(mongoose.models)) {
      console.log(`Ensuring indexes for model: ${name}`);
      await mongoose.models[name].syncIndexes();
    }

    console.log("Indexes created/synced successfully");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create indexes:", err);
    process.exit(1);
  }
};

create();
