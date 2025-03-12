import express from "express";
import {
	fetchProfile,
	login,
	logout,
	registerUser,
	updateProfile,
	findUsers
} from "./controllers.js";
import { isAuthenticated } from "../../utils/auth.js";

const router = express.Router();

router.get("/all", findUsers)
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/:userID", isAuthenticated, fetchProfile);
router.put("/:userID", isAuthenticated, updateProfile);

export default router;
