import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mood: { type: String, required: true },
    content: { type: String, required: true },
    collection: { type: String },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Journal = mongoose.model("Journal", journalSchema);
