import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createJournal, getJournals } from "../controller/journalController.js";

const router = express.Router();

router.post("/", authMiddleware, createJournal);
router.post("/publish", authMiddleware, createJournal);
router.post("/draft", authMiddleware, createJournal);
router.get("/", authMiddleware, getJournals);

export default router;
