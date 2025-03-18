import express from "express";
import {
	createConversation,
	deleteConversation,
	fetchConversation,
	fetchGroupConversation,
	fetchUserConversations,
	updateConversationSetting,
} from "./controllers.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/chat", fetchConversation);
// router.get("/group", fetchGroupConversation);
router.get("/user/:userID", fetchUserConversations);
router.put("/:chatID", updateConversationSetting);
router.delete("/:chatID", deleteConversation);

export default router;
