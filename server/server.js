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
import chatRoutes from "./routes/chatRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

dotenv.config({});
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e7 // 10MB
});

// Configuring CORS
const corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions));

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "10mb" }));
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {
    res.send('Welcome')
})

// Socket.io logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", async (data) => {
        const { sender, receiver, message, room, fileUrl, fileType, fileName } = data;
        
        try {
            const newMessage = new Message({
                sender,
                receiver,
                message,
                room,
                fileUrl,
                fileType,
                fileName
            });
            await newMessage.save();
            
            // Broadcast the message to the room
            io.to(room).emit("receive_message", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})