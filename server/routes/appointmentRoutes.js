import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  getTherapistAppointments,
  getMyTherapistAppointments,
} from "../controller/appointmentController.js";

const router = express.Router();

// All appointment routes require authentication
// POST /api/appointments          -> create
router.post("/", authMiddleware, createAppointment);

// GET /api/appointments/my-appointments -> get logged-in therapist's appointments
router.get("/my-appointments", authMiddleware, getMyTherapistAppointments);

// GET /api/appointments/therapist/:therapistId -> get therapist's appointments
router.get("/therapist/:therapistId", authMiddleware, getTherapistAppointments);

// GET /api/appointments           -> list (user's own appointments)
router.get("/", authMiddleware, getAppointments);

// GET /api/appointments/:id       -> get single (user's own)
router.get("/:id", authMiddleware, getAppointment);

// PATCH /api/appointments/:id     -> update (e.g., change status)
router.patch("/:id", authMiddleware, updateAppointment);

export default router;
