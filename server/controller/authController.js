import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { Therapist } from "../models/Therapist.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const {  name, email, password, gender, role, specialization, bio } = req.body;

        // See if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            role
        });

        if (user.role === 'therapist') {
            try {
                console.log("Creating therapist profile for user:", user._id, user.name);
                const therapistProfile = await Therapist.create({
                    user: user._id, // Link to the User document
                    name: user.name,
                    specialization: specialization || [], // Use data from request or default
                    bio: bio || "" ,
                });
                console.log("✓ Profile for therapist created successfully", therapistProfile._id);
            } catch (therapistError) {
                console.error("✗ Failed to create therapist profile:", therapistError.message);
                console.error("Full error:", therapistError);
                // Continue with registration even if therapist profile creation fails
                // They can complete onboarding later
            }
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return user and token (never send password)
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
            },
            token,
            message: "Registration successful!",
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email, include password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return user and token
        res.json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get logged-in user's profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const syncClerkUser = async (req, res) => {
    try {
        const { role, name, email } = req.body;

        const safeRole = role === "therapist" ? "therapist" : "user";

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name && typeof name === "string" && name.trim()) {
            user.name = name.trim();
        }

        if (email && typeof email === "string" && email.trim()) {
            user.email = email.trim().toLowerCase();
        }

        if (safeRole && user.role !== safeRole) {
            user.role = safeRole;
        }

        await user.save();

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
                clerkId: user.clerkId,
            },
        });
    } catch (err) {
        console.error("syncClerkUser error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
