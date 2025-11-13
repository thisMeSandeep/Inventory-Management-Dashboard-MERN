import upload from "@/config/multer.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "@/controllers/product.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import express, { Router } from "express";

const router: Router = express.Router();

// create a product
router.route("/product").post(
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct
);

// update a product
router.route("/product/:productId").put(
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct
);

// get all products
router.route("/products").get(authMiddleware, getAllProducts);

// get single product
router.route("/product/:productId").get(authMiddleware, getProduct);

// delete a product
router.route("/product/:productId").delete(authMiddleware, deleteProduct);

export default router;
