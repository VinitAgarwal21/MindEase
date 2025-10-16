import express from "express";
import { Journal } from "../models/Journal.js";

const router = express.Router();

// Publish journal
router.post("/publish", async (req, res) => {
  try {
    const { title, mood, content, collection } = req.body;
    const journal = await Journal.create({
      title,
      mood,
      content,
      collection,
      isDraft: false,
    });
    res.status(201).json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to publish journal" });
  }
});

// Save draft
router.post("/draft", async (req, res) => {
  try {
    const {title, mood, content, collection } = req.body;
    const journal = await Journal.create({
      title,
      mood,
      content,
      collection,
      isDraft: true,
    });
    res.status(201).json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save draft" });
  }
});

// Get all journals (optional)
router.get("/", async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch journals" });
  }
});

export default router;
