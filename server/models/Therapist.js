import mongoose from "mongoose"

const therapistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   lowercase: true,
  //   trim: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   select: false,
  // },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: [String],        // E.g., ['Anxiety', 'Depression']
  qualifications: String,
  experience: Number,               // Years of experience
  bio: String,
  profilePicture: String,
  availableSlots: [
    {
      day: String,                 // e.g., "Monday"
      startTime: String,           // e.g., "10:00"
      endTime: String,             // e.g., "16:00"
    },
  ],
  chatSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
  videoSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VideoCallSession' }],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      review: String,
    },
  ],
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // Add more fields if needed for therapist profile
}, { timestamps: true });

export const Therapist = mongoose.model('Therapist', therapistSchema);
