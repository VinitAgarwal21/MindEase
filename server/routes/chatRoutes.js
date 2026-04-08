import express from "express";
import { getMessages } from "../controller/chatController.js";

const router = express.Router();

router.get("/:room", getMessages);

export default router;
