import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config({});
connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Configuring CORS
const corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions));

const PORT = 5000;

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/appointments", appointmentRoutes);


app.get('/', (req, res) => {
    res.send('Welcome')
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})