import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./src/users/routes.js";

configDotenv();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
