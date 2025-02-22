import express from "express";
import {
	addFriend,
	deleteFriend,
	fetchFriends,
	fetchProfile,
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
router.post("/:userID/friends", isAuthenticated, addFriend);
router.delete("/:userID/friends/:friendID", isAuthenticated, deleteFriend);

export default router;
