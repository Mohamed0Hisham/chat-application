import express from "express";

const router = express.Router();

router.post("/", createConversation);
router.get("/:chatID", fetchConversation);
router.get("/user/:userID", fetchUserConversations);
router.put("/:chatID", updateConversationSetting);
router.delete("/:chatID", deleteConversation);

export default router;
