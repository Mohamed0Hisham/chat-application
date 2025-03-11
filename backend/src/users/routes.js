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

export default router;
