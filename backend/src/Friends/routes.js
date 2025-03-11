import express from "express";
import { isAuthenticated } from "../../utils/auth.js";
import {
	addFriend,
	deleteFriend,
	fetchFriend,
	fetchFriends,
	fetchRequests,
	sendFriendRequest,
} from "./controllers.js";

const router = express.Router();

router.get("/requests", isAuthenticated, fetchRequests);
router.post("/accept", isAuthenticated, addFriend);
router.post("/request/:friendID", isAuthenticated, sendFriendRequest);
router.get("/:userID/friends", isAuthenticated, fetchFriends);
router.get("/:userID/friends/:friendID", isAuthenticated, fetchFriend);
router.delete("/:userID/friends/:friendID", isAuthenticated, deleteFriend);

export default router;
