import express from "express";
import {
  getAllTherapists,
  getTherapistById,
  updateTherapistProfile,
  deleteTherapist,
  getMyProfile,
} from "../controller/therapistController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all therapists
router.get("/", getAllTherapists);

// Get my therapist profile (logged-in therapist)
router.get("/my-profile", authMiddleware, getMyProfile);

// Update therapist profile (only therapist or admin can do this) - MUST come before /:id
router.put("/profile", authMiddleware, updateTherapistProfile);

// Get therapist by ID
router.get("/:id", getTherapistById);

// Update therapist by ID
router.put("/:id", authMiddleware, updateTherapistProfile);

// Delete therapist profile (admin or self)
router.delete("/:id", authMiddleware, deleteTherapist);

export default router;
