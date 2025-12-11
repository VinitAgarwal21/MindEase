import { Therapist } from "../models/Therapist.js";
import { User } from "../models/User.js";

// Get all therapists (public)
export const getAllTherapists = async (req, res) => {
    try {
        const therapists = await Therapist.find().select("-password").sort({ createdAt: -1 });
        console.log("Found therapists:", therapists.length);
        res.json(therapists);
    } catch (err) {
        console.error("Get all therapists error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a therapist by ID (public)
export const getTherapistById = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id).select("-password");
        if (!therapist) {
            return res.status(404).json({ message: "Therapist not found" });
        }
        res.json(therapist);
    } catch (err) {
        console.error("Get therapist by ID error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update therapist profile (protected)
export const updateTherapistProfile = async (req, res) => {
    try {
        // Only update if therapist is self or admin (you can expand this logic as needed)
        if (req.user.role !== "therapist") {
            return res.status(403).json({ message: "Access denied. Only therapists can update profiles." });
        }

        const updateFields = req.body;

        console.log("Looking for therapist with user ID:", req.user.id);
        
        let therapistProfile = await Therapist.findOne({ user: req.user.id });
        
        if (!therapistProfile) {
            console.log("Therapist profile not found, creating one...");
            // Fetch user to get the name
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            // If therapist profile doesn't exist, create it
            therapistProfile = await Therapist.create({
                user: req.user.id,
                name: user.name,
                ...updateFields
            });
        } else {
            // Update existing profile
            therapistProfile = await Therapist.findOneAndUpdate(
                { user: req.user.id },
                updateFields,
                { new: true, runValidators: true }
            );
        }

        res.json({
            message: "Profile updated successfully!",
            profile: therapistProfile
        });
    } catch (err) {
        console.error("Update therapist profile error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get my therapist profile (protected)
export const getMyProfile = async (req, res) => {
    try {
        if (req.user.role !== "therapist") {
            return res.status(403).json({ message: "Access denied. Only therapists can access this." });
        }

        const therapistProfile = await Therapist.findOne({ user: req.user.id });
        
        res.json({
            success: true,
            profile: therapistProfile
        });
    } catch (err) {
        console.error("Get my profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Will do it later
// Delete therapist profile (protected)
export const deleteTherapist = async (req, res) => {
    try {
        // Only admin or therapist themselves can delete
        if (req.user.role !== "therapist") {
            return res.status(403).json({ message: "Access denied" });
        }
        if (req.user.role === "therapist" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Can only delete your own profile" });
        }

        const therapist = await Therapist.findByIdAndDelete(req.params.id);
        if (!therapist) {
            return res.status(404).json({ message: "Therapist not found" });
        }
        res.json({ message: "Therapist profile deleted" });
    } catch (err) {
        console.error("Delete therapist profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
