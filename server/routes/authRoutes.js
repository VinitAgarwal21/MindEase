import express from "express";
import authMiddleware from "../middleware/auth.js";

// Import controller functions
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";


const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

export default router;
