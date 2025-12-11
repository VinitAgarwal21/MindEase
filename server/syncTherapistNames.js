import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Therapist } from "./models/Therapist.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all therapist profiles
    const therapists = await Therapist.find();
    console.log(`Found ${therapists.length} therapist profiles\n`);

    let updated = 0;

    for (const therapist of therapists) {
      // Get the user associated with this therapist
      const user = await User.findById(therapist.user);
      
      if (user && user.name !== therapist.name) {
        console.log(`Updating: "${therapist.name}" → "${user.name}"`);
        
        // Update the therapist profile with the correct name from User
        await Therapist.findByIdAndUpdate(
          therapist._id,
          { name: user.name },
          { new: true }
        );
        updated++;
      } else if (user) {
        console.log(`✓ "${therapist.name}" - Already correct`);
      } else {
        console.log(`⚠ Therapist ${therapist._id} has no associated User`);
      }
    }

    console.log(`\n✓ Updated ${updated} therapist profiles`);
    console.log("Done! Restart your server and refresh the therapists page.");
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
