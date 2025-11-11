import upload from "@/config/multer.js";
import { createProduct } from "@/controllers/product.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import express, { Router } from "express";

const router: Router = express.Router();

router.route("/product").post(
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct
);

export default router;
