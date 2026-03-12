import { Appointment } from "../models/Appointment.js";
import { Therapist } from "../models/Therapist.js";
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

    // Always use the authenticated user's ID
    const userId = req.user.id;

    console.log("Creating appointment:", { userId, therapistId, therapistName, userName, userEmail, preferredDate, preferredTime });

    const appt = new Appointment({
      userId,
      therapistId: therapistId || undefined,
      therapistName,
      userName,
      userEmail,
      preferredDate,
      preferredTime,
      note,
      sessionFee,
      status: "pending",
    });

    await appt.save();
    console.log("✓ Appointment created:", appt._id);
    return res.status(201).json({ success: true, appointment: appt });
  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    // Only return appointments belonging to the authenticated user
    const filter = { userId: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    console.log("Fetching appointments with filter:", filter);
    const list = await Appointment.find(filter)
      .populate("therapistId", "name specialization")
      .sort({ createdAt: -1 })
      .limit(500);
    console.log(`Found ${list.length} appointments`);
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

    const appt = await Appointment.findOne({ _id: id, userId: req.user.id });
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

    // Users can only update their own appointments; therapists can update appointments assigned to them
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const isOwner = appt.userId && appt.userId.toString() === req.user.id;
    // Check if the authenticated user is the therapist for this appointment
    let isTherapist = false;
    if (appt.therapistId) {
      const therapistProfile = await Therapist.findOne({ user: req.user.id });
      if (therapistProfile && appt.therapistId.toString() === therapistProfile._id.toString()) {
        isTherapist = true;
      }
    }

    if (!isOwner && !isTherapist) {
      return res.status(403).json({ error: "Not authorized to update this appointment" });
    }

    const updated = await Appointment.findByIdAndUpdate(id, updates, { new: true });
    return res.json({ success: true, appointment: updated });
  } catch (err) {
    console.error("updateAppointment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all appointments for a specific therapist
 * GET /api/appointments/therapist/:therapistId?status=pending
 */
export const getTherapistAppointments = async (req, res) => {
  try {
    const { therapistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({ error: "Invalid therapistId" });
    }

    const filter = { therapistId };
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(500);

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error("getTherapistAppointments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get appointments for the logged-in therapist (by user ID)
 * GET /api/appointments/my-appointments?status=pending
 */
export const getMyTherapistAppointments = async (req, res) => {
  try {
    // Find the therapist profile for this user
    const therapist = await Therapist.findOne({ user: req.user.id });
    if (!therapist) {
      return res.status(404).json({ error: "Therapist profile not found" });
    }

    const filter = { therapistId: therapist._id };
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(500);

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error("getMyTherapistAppointments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
