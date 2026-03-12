import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getUserProfile } from "../controller/userController.js";

const router = express.Router();

router.get("/:id", authMiddleware, getUserProfile);

export default router;
