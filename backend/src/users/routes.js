import express from "express";
import { addFriend, deleteFriend, fetchFriends, fetchProfile, login, registerUser, updateProfile } from "./controllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/:userID", fetchProfile);
router.put("/:userID", updateProfile);
router.get("/:userID/friends", fetchFriends);
router.post("/:userID/friends", addFriend);
router.delete("/:userID/friends/:friendID", deleteFriend);

export default router;
