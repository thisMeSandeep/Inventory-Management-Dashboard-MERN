import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";

const app: Express = express();

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
app.use("/api/v1/product", productRouter);

// test route
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

export default app;
