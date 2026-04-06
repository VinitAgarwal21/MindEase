import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: false }, // optional if using DB therapists
  therapistName: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  preferredDate: { type: String, required: true }, // use string for form date, or Date if you convert
  preferredTime: { type: String, required: true },
  note: { type: String },
  sessionFee: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentId: { type: String },
  paymentOrderId: { type: String },
  paymentSignature: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
