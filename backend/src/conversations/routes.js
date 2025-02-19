import express from "express";
import {
	createConversation,
	deleteConversation,
	fetchConversation,
	fetchUserConversations,
	updateConversationSetting,
} from "./controllers.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:chatID", fetchConversation);
router.get("/user/:userID", fetchUserConversations);
router.put("/:chatID", updateConversationSetting);
router.delete("/:chatID", deleteConversation);

export default router;
