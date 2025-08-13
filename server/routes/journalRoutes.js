import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  createJournal,
  getUserJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";


const router = express.Router();

// Create a new journal entry
router.post("/", authMiddleware, createJournal);

// Get all journals for the logged-in user
router.get("/", authMiddleware, getUserJournals);

// Get a single journal by ID
router.get("/:id", authMiddleware, getJournalById);

// Update a journal entry
router.put("/:id", authMiddleware, updateJournal);

// Delete a journal entry
router.delete("/:id", authMiddleware, deleteJournal);

export default router;
