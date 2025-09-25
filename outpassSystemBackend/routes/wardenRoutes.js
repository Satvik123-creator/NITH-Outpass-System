import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getPendingOutpasses,
  getAllOutpasses,
  getOutpassById,
  updateOutpass,
} from "../controllers/wardenController.js";

const router = express.Router();

router.use(protect, authorizeRoles("warden"));

router.get("/pending", getPendingOutpasses);
router.put("/update/:id", updateOutpass); // approve/reject
router.get("/all", getAllOutpasses);
// Place dynamic id route last so it doesn't capture static routes like /all
router.get("/:id", getOutpassById);

export default router;
