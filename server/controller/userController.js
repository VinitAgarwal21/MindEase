import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user id" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // const appointments = await Appointment.find({ userId: id })
    //   .sort({ createdAt: -1 });
    const appointments = await Appointment.find()
      .populate("therapistId", "name specialization")
      .lean();

    // // Map to include therapist name easily
    // const formattedAppointments = appointments.map((a) => ({
    //   _id: a._id,
    //   therapistName: a.therapistId?.name || "N/A",
    //   preferredDate: a.preferredDate,
    //   preferredTime: a.preferredTime,
    //   status: a.status || "pending",
    // }));

    return res.json({ success: true, user, appointments });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
