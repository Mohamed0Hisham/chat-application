import express from "express"
import { isAuthenticated } from "../../utils/auth";
import { fetchRequets } from "./controllers";

const router = express.Router();

router.get("/requests", isAuthenticated, fetchRequets)

export default router