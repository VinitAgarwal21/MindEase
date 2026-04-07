import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
    select: false // do not include by default in queries
  },
  gender: String,
  profilePicture: String,
  journals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }],
  yogaTracker: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tracker' }],
  musicPreferences: [String],
  role: {
    type: String,
    enum: ['user', 'therapist'],
    default: 'user'
  },
  roleLocked: {
    type: Boolean,
    default: false,
  },
  // Add more fields if needed
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);
