import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { Therapist } from "../models/Therapist.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const {  name, email, password, gender, role, specialization, bio } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedRole = String(role || "user").trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (normalizedRole !== "user" && normalizedRole !== "therapist") {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        // See if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(409).json({ message: "This email is already registered. Please login." });
        }

        // Hash password    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            gender,
            role: normalizedRole,
            roleLocked: true,
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
        const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : null;
        const hasValidRole = normalizedRole === "user" || normalizedRole === "therapist";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name && typeof name === "string" && name.trim()) {
            user.name = name.trim();
        }

        if (normalizedEmail && normalizedEmail !== user.email) {
            const emailOwner = await User.findOne({ email: normalizedEmail });
            if (emailOwner && String(emailOwner._id) !== String(user._id)) {
                return res.status(409).json({
                    message: "This email is already registered. Please login.",
                });
            }
            user.email = normalizedEmail;
        }

        const therapistProfile = await Therapist.findOne({ user: user._id });

        if (therapistProfile && user.role !== "therapist") {
            user.role = "therapist";
            user.roleLocked = true;
        }

        if (!user.roleLocked) {
            if (hasValidRole) {
                user.role = normalizedRole;
            }
            user.roleLocked = true;
        }

        if (user.role === "therapist") {
            if (!therapistProfile) {
                await Therapist.create({
                    user: user._id,
                    name: user.name,
                    specialization: [],
                    bio: "",
                });
            }
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
