import express from "express";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
app.use(express.json());


export default app