import {Journal} from "../models/Journal.js";

import mongoose from "mongoose";

export const createJournal = async (req, res) => {
  try {
    const { text, emotions } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const journal = await Journal.create({
      user: req.user.id,
      text,
      emotions: Array.isArray(emotions) ? emotions : []
    });

    res.status(201).json(journal);
  } catch (err) {
    console.error("Create journal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all journals of the logged-in user
export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    console.error("Get journals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get a single journal by ID
export const getJournalById = async (req, res) => {
    try {
        const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
        if (!journal) {
            return res.status(404).json({ message: "Journal not found" });
        }
        res.json(journal);
    } catch (err) {
        console.error("Get journal by ID error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a journal entry
export const updateJournal = async (req, res) => {
    try {
        const { title, content, mood, tags } = req.body;

        // Only update if journal belongs to logged-in user
        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content, mood, tags, isPrivate },
            { new: true }
        );

        if (!journal) {
            return res.status(404).json({ message: "Journal not found or unauthorized" });
        }

        res.json(journal);
    } catch (err) {
        console.error("Update journal error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a journal entry
export const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!journal) {
            return res.status(404).json({ message: "Journal not found or unauthorized" });
        }
        res.json({ message: "Journal deleted" });
    } catch (err) {
        console.error("Delete journal error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
