import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./src/users/routes.js";
import conversationRoutes from "./src/conversations/routes.js";
import messagesRoutes from "./src/messages/routes.js";

configDotenv();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messagesRoutes);

export default app;
