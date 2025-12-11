import express from "express";
import { createJournal, getJournals } from "../controller/journalController.js";

const router = express.Router();

router.post("/", createJournal);
router.get("/", getJournals);

export default router;
