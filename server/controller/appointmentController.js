import { Appointment } from "../models/Appointment.js";
import mongoose from "mongoose";

/**
 * Create an appointment
 * Expected body:
 * {
 *   therapistId?, therapistName, userName, userEmail, preferredDate, preferredTime, note?, sessionFee?
 * }
 */
export const createAppointment = async (req, res) => {
  try {
    const {
      therapistId,
      therapistName,
      userName,
      userEmail,
      preferredDate,
      preferredTime,
      note,
      sessionFee,
    } = req.body;

    // basic validation
    if (!therapistName || !userName || !userEmail || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // if therapistId provided, ensure valid ObjectId
    if (therapistId && !mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({ error: "Invalid therapistId" });
    }

    const appt = new Appointment({
      therapistId: therapistId || undefined,
      therapistName,
      userName,
      userEmail,
      preferredDate,
      preferredTime,
      note,
      sessionFee,
      status: "pending", // explicit but model default covers it
    });

    await appt.save();
    return res.status(201).json({ success: true, appointment: appt });
  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    // Optionally pass query ?status=pending
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const list = await Appointment.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json({ success: true, appointments: list });
  } catch (err) {
    console.error("getAppointments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("getAppointment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update status (or other writable fields)
 * Accepts body: { status: 'confirmed' } etc.
 */
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });

    const appt = await Appointment.findByIdAndUpdate(id, updates, { new: true });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("updateAppointment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
