import express from "express";
import {
  createOutpass,
  getStudentOutpasses,
  getPendingOutpasses,
} from "../controllers/studentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply for a new outpass
router.post("/apply", protect, authorizeRoles("student"), createOutpass);

// Get all outpasses (history)
router.get("/all", protect, authorizeRoles("student"), getStudentOutpasses);

// Get pending outpasses
router.get("/pending", protect, authorizeRoles("student"), getPendingOutpasses);

export default router;
