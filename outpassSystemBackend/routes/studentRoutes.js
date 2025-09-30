import express from "express";
import {
  createOutpass,
  getStudentOutpasses,
  getPendingOutpasses,
  getOutpassById,
} from "../controllers/studentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createOutpassValidator,
  idParamValidator,
} from "../validators/requestValidators.js";

const router = express.Router();

// Apply for a new outpass
router.post(
  "/apply",
  protect,
  authorizeRoles("student"),
  createOutpassValidator,
  validateRequest,
  createOutpass
);

// Get all outpasses (history)
router.get("/all", protect, authorizeRoles("student"), getStudentOutpasses);

// Get pending outpasses
router.get("/pending", protect, authorizeRoles("student"), getPendingOutpasses);

// Get single outpass by id (history/details)
router.get(
  "/:id",
  protect,
  authorizeRoles("student"),
  idParamValidator,
  validateRequest,
  getOutpassById
);

export default router;
