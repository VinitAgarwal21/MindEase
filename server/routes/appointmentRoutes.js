import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  getTherapistAppointments,
} from "../controller/appointmentController.js";

const router = express.Router();

// POST /api/appointments          -> create
router.post("/", createAppointment);

// GET /api/appointments/therapist/:therapistId -> get therapist's appointments
router.get("/therapist/:therapistId", getTherapistAppointments);

// GET /api/appointments           -> list (optionally ?status=pending)
router.get("/", getAppointments);

// GET /api/appointments/:id       -> get single
router.get("/:id", getAppointment);

// PATCH /api/appointments/:id     -> update (e.g., change status)
router.patch("/:id", updateAppointment);

export default router;
