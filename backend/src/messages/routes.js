import express from "express";
import { deleteMsg, editMsg, fetchMsgs, sendMsg } from "./controllers.js";

const router = express.Router();

router.post("/:chatID", sendMsg);
router.get("/:chatID", fetchMsgs);
router.put("/:msgID", editMsg);
router.delete("/:msgID", deleteMsg);

export default router;
