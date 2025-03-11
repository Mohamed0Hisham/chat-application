import express from "express"
import { isAuthenticated } from "../../utils/auth.js";
import { fetchRequets } from "./controllers.js";

const router = express.Router();

router.get("/requests", isAuthenticated, fetchRequets)

export default router