import express from "express";
import { handleTherapyMessage } from "../controller/therapyController.js";

const router = express.Router();
router.post("/therapy", handleTherapyMessage);

export default router;
