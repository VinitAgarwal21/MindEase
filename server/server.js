import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Welcome')
})