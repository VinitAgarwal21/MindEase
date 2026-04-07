import { Appointment } from "../models/Appointment.js";
import { Therapist } from "../models/Therapist.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendAppointmentConfirmedEmail } from "../utils/mailer.js";

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

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

/**
 * Create Razorpay order for appointment booking
 * POST /api/appointments/create-payment-order
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { therapistId } = req.body;

    if (!therapistId || !mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({ error: "Invalid therapistId" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay keys are not configured on server" });
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(500).json({ error: "Razorpay client is not configured" });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    const sessionFee = Number(therapist.hourlyRate || 0);
    if (!sessionFee || sessionFee <= 0) {
      return res.status(400).json({ error: "Therapist has not configured a valid session fee" });
    }

    const amountInPaise = Math.round(sessionFee * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `appt_${Date.now()}`,
      notes: {
        therapistId: therapist._id.toString(),
        therapistName: therapist.name,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      order,
      amount: sessionFee,
      currency: "INR",
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      therapistName: therapist.name,
    });
  } catch (err) {
    console.error("createPaymentOrder error:", err);
    return res.status(500).json({ error: "Failed to create payment order" });
  }
};

/**
 * Verify Razorpay payment and book appointment
 * POST /api/appointments/verify-payment-and-book
 */
export const verifyPaymentAndBookAppointment = async (req, res) => {
  try {
    const {
      therapistId,
      therapistName,
      userName,
      userEmail,
      preferredDate,
      preferredTime,
      note,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !therapistId ||
      !userName ||
      !userEmail ||
      !preferredDate ||
      !preferredTime ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(therapistId)) {
      return res.status(400).json({ error: "Invalid therapistId" });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay key secret is not configured on server" });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }

    const existingAppointment = await Appointment.findOne({ paymentId: razorpay_payment_id });
    if (existingAppointment) {
      return res.status(200).json({ success: true, appointment: existingAppointment });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const appt = new Appointment({
      userId: req.user.id,
      therapistId,
      therapistName: therapist.name,
      userName,
      userEmail,
      preferredDate,
      preferredTime,
      note,
      sessionFee: Number(therapist.hourlyRate || 0),
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      paymentOrderId: razorpay_order_id,
      paymentSignature: razorpay_signature,
      status: "pending",
    });

    await appt.save();

    return res.status(201).json({ success: true, appointment: appt });
  } catch (err) {
    console.error("verifyPaymentAndBookAppointment error:", err);
    return res.status(500).json({ error: "Failed to verify payment and book appointment" });
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

    const previousStatus = appt.status;
    const updated = await Appointment.findByIdAndUpdate(id, updates, { new: true });

    let emailNotification = { sent: false };
    if (isTherapist && updates.status === "confirmed" && previousStatus !== "confirmed") {
      try {
        emailNotification = await sendAppointmentConfirmedEmail({
          to: updated.userEmail,
          userName: updated.userName,
          therapistName: updated.therapistName,
          preferredDate: updated.preferredDate,
          preferredTime: updated.preferredTime,
        });
      } catch (mailErr) {
        console.error("Failed to send confirmation email:", mailErr.message || mailErr);
        emailNotification = { sent: false, reason: "EMAIL_SEND_FAILED" };
      }
    }

    return res.json({
      success: true,
      appointment: updated,
      emailNotification,
    });
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
    let therapist = await Therapist.findOne({ user: req.user.id });
    if (!therapist) {
      if (req.user.role !== "therapist") {
        return res.status(404).json({ error: "Therapist profile not found" });
      }

      therapist = await Therapist.create({
        user: req.user.id,
        name: req.user.name || "Therapist",
      });
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
