import express from "express";
import {
	createConversation,
	deleteConversation,
	fetchConversation,
	fetchGroupConversation,
	fetchUserConversations,
	updateConversationSetting,
} from "./controllers.js";
import { isAuthenticated } from "../../utils/auth.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/chat",isAuthenticated ,fetchConversation);
router.get("/group",isAuthenticated ,fetchGroupConversation);
router.get("/user/:userID", fetchUserConversations);
router.put("/:chatID", updateConversationSetting);
router.delete("/:chatID", deleteConversation);

export default router;
