import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config({});
connectDB();

const app = express();

// Configuring CORS — must come before clerkMiddleware so preflight requests succeed
const corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions));

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/journals", journalRoutes);

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})