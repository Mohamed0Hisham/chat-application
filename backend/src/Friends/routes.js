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

router.get("/requests", isAuthenticated, fetchRequests);
router.post("/accept", isAuthenticated, acceptFriend);
router.post("/decline", isAuthenticated, declineFriend);
router.post("/request/:friendID", isAuthenticated, sendFriendRequest);
router.get("/:userID/friends", isAuthenticated, fetchFriends);
router.get("/:userID/friends/:friendID", isAuthenticated, fetchFriend);
router.delete("/:userID/friends/:friendID", isAuthenticated, deleteFriend);

export default router;
