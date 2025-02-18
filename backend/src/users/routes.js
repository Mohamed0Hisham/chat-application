import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/:userID", fetchProfile);
router.put("/:userID", updateProfile);
router.get("/:userID/friends", fetchFriends);
router.post("/:userID/friends", addFriend);
router.delete("/:userID/friends?who=friendID", deleteFriend);

export default router;
