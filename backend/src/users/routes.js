import express from "express";
import {
	fetchProfile,
	login,
	logout,
	registerUser,
	updateProfile,
	findUsers,
} from "./controllers.js";
import { isAuthenticated } from "../../utils/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/all", isAuthenticated, findUsers);
router.post("/logout", isAuthenticated, logout);
router.get("/:userID", isAuthenticated, fetchProfile);
router.put("/:userID", isAuthenticated, updateProfile);

export default router;
