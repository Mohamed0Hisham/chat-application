import express from "express";
import {
	addFriend,
	deleteFriend,
	fetchFriends,
	fetchFriend,
	fetchProfile,
	sendFriendRequest,
	login,
	logout,
	registerUser,
	updateProfile,
} from "./controllers.js";
import { isAuthenticated } from "../../utils/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/:userID", isAuthenticated, fetchProfile);
router.put("/:userID", isAuthenticated, updateProfile);
router.get("/:userID/friends", isAuthenticated, fetchFriends);
router.get("/:userID/friends/:friendID", isAuthenticated, fetchFriend);
router.post("/:userID/friends", isAuthenticated, addFriend);
router.post("/friendrequest", isAuthenticated, sendFriendRequest);
router.delete("/:userID/friends/:friendID", isAuthenticated, deleteFriend);

export default router;
