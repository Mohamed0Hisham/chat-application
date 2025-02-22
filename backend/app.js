import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./src/users/routes.js";
import conversationRoutes from "./src/conversations/routes.js";
import messagesRoutes from "./src/messages/routes.js";
import { refreshToken } from "./utils/refreshToken.js";
import { isAuthenticated } from "./utils/auth.js";

configDotenv();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/conversations", isAuthenticated, conversationRoutes);
app.use("/api/messages", isAuthenticated, messagesRoutes);
app.use("/api/auth/refresh", refreshToken);

export default app;
