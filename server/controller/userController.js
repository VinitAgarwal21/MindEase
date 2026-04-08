import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Journal } from "../models/Journal.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid user id" });

    const targetUser = await User.findById(id).select("-password").lean();
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // Users can only view their own private data
    if (req.user.id !== id) {
      // If therapist, they can only see the profile metadata (name, pic) for chat
      if (req.user.role === "therapist") {
        return res.json({ 
          success: true, 
          user: { 
            name: targetUser.name, 
            profilePicture: targetUser.profilePicture, 
            email: targetUser.email,
            _id: targetUser._id 
          } 
        });
      }
      return res.status(403).json({ error: "Not authorized to view this profile" });
    }

    const appointments = await Appointment.find({ userId: id })
      .populate("therapistId", "name specialization")
      .sort({ createdAt: -1 })
      .lean();

    const journals = await Journal.find({ user: id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, user: targetUser, appointments, journals });
  } catch (err) {
    console.error("getUserProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
