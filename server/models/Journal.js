import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    emotions: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Journal = mongoose.model("Journal", journalSchema);
