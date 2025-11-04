import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/user.routes.js";

const app: Express = express();

// dotenv config
dotenv.config();

// middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

//Api routes
app.use("/api/v1/user", userRouter);

// test route
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

export default app;
