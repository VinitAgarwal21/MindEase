import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Therapist } from "./models/Therapist.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("Connected to MongoDB");

    // Find all users with role 'therapist'
    const therapistUsers = await User.find({ role: "therapist" });
    console.log(`Found ${therapistUsers.length} therapist users`);

    let created = 0;
    let existing = 0;

    for (const user of therapistUsers) {
      // Check if therapist profile already exists
      const existingProfile = await Therapist.findOne({ user: user._id });
      
      if (!existingProfile) {
        try {
          await Therapist.create({
            user: user._id,
            name: user.name,
            specialization: [],
            bio: "",
          });
          console.log(`✓ Created therapist profile for ${user.name}`);
          created++;
        } catch (err) {
          console.error(`✗ Failed to create profile for ${user.name}:`, err.message);
        }
      } else {
        existing++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Created: ${created} new therapist profiles`);
    console.log(`- Already existed: ${existing} profiles`);
    console.log(`\nDone! Restart your server and refresh the therapists page.`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
