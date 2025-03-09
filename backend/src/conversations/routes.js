import express from "express";
import {
	createConversation,
	deleteConversation,
	fetchConversation,
	fetchUserConversations,
	updateConversationSetting,
} from "./controllers.js";
import { isAuthenticated } from "../../utils/auth.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:userID",isAuthenticated ,fetchConversation);
router.get("/user/:userID", fetchUserConversations);
router.put("/:chatID", updateConversationSetting);
router.delete("/:chatID", deleteConversation);

export default router;
