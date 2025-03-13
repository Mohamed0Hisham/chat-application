import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./src/users/routes.js";
import conversationRoutes from "./src/conversations/routes.js";
import messagesRoutes from "./src/messages/routes.js";
import friendRoutes from "./src/Friends/routes.js";
import { refreshToken } from "./utils/refreshToken.js";
import { isAuthenticated } from "./utils/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

configDotenv();
const app = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
		allowedHeaders: ["Content-Type", "Authorization"], 
	})
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/friends", isAuthenticated, friendRoutes);
app.use("/api/conversations", isAuthenticated, conversationRoutes);
app.use("/api/messages", isAuthenticated, messagesRoutes);
app.post("/api/auth/refresh", refreshToken);

export default app;
