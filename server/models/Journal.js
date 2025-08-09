import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Link to User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "angry",
        "anxious",
        "excited",
        "neutral",
        "stressed",
        "relaxed",
      ],
      default: "neutral",
    },
    tags: [String], // Optional tags like ['gratitude', 'goals', 'dream']
    
    // If using ML analysis
    // analysis: {
    //   sentimentScore: Number, // from ML model
    //   sentimentLabel: String, // e.g., "positive", "negative", "neutral"
    //   keyPhrases: [String],
    // },

    // isPrivate: {
    //   type: Boolean,
    //   default: true, // Journal entries are private by default
    // },
  }, { timestamps: true });

export const Journal = mongoose.model("Journal", journalSchema);;
