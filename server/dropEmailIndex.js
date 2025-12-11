import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    
    // Drop the email_1 index if it exists
    try {
      await db.collection("therapists").dropIndex("email_1");
      console.log("✓ Dropped email_1 index from therapists collection");
    } catch (err) {
      if (err.message.includes("index not found")) {
        console.log("ℹ Index email_1 doesn't exist, nothing to drop");
      } else {
        throw err;
      }
    }
    
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
