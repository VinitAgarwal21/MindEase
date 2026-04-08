import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await Message.find({ room }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};
