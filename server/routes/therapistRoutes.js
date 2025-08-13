import express from "express";
import {
  getAllTherapists,
  getTherapistById,
  updateTherapistProfile,
  deleteTherapist,
} from "../controllers/therapistController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all therapists
router.get("/", getAllTherapists);

// Get therapist by ID
router.get("/:id", getTherapistById);

// Update therapist profile (only therapist or admin can do this)
router.put("/:id", authMiddleware, updateTherapistProfile);

// Delete therapist profile (admin or self)
router.delete("/:id", authMiddleware, deleteTherapist);

export default router;
