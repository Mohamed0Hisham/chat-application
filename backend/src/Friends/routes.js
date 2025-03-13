import express from "express";
import { isAuthenticated } from "../../utils/auth.js";
import {
	sendFriendRequest,
	fetchRequests,
	acceptFriend,
	declineFriend,
	fetchFriend,
	fetchFriends,
	deleteFriend,
} from "./controllers.js";

const router = express.Router();

router.get("/all", fetchFriends);
router.get("/requests", fetchRequests);
router.post("/accept", acceptFriend);
router.post("/decline", declineFriend);
router.post("/request/:friendID", sendFriendRequest);
router.get("/:userID/friends/:friendID", fetchFriend);
router.delete("/:userID/friends/:friendID", deleteFriend);

export default router;
