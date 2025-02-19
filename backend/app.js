import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./src/users/routes.js";
import conversationRoutes from "./src/conversations/routes.js";

configDotenv();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

export default app;
