import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Journal } from "../models/Journal.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user id" });

    // Users can only view their own profile
    if (req.user.id !== id) {
      return res.status(403).json({ error: "Not authorized to view this profile" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Only fetch this user's appointments
    const appointments = await Appointment.find({ userId: id })
      .populate("therapistId", "name specialization")
      .sort({ createdAt: -1 })
      .lean();

    // Only fetch this user's journals
    const journals = await Journal.find({ user: id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, user, appointments, journals });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
