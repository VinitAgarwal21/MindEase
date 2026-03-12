import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../models/User.js";

const getPrimaryEmail = (clerkUser) => {
  const primary = clerkUser.emailAddresses?.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );
  return primary?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || "";
};

const authMiddleware = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(auth.userId);
      const email = getPrimaryEmail(clerkUser);

      if (!email) {
        return res.status(401).json({ message: "Unable to resolve user email from Clerk" });
      }

      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          clerkId: auth.userId,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
          email,
          role: clerkUser.publicMetadata?.role === "therapist" ? "therapist" : "user",
        });
      } else if (!user.clerkId) {
        user.clerkId = auth.userId;
        await user.save();
      }
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      clerkId: user.clerkId,
    };

    next();
  } catch (err) {
    console.error("Auth middleware failed:", err.message);
    console.error("Full error:", err);
    return res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

export default authMiddleware;
