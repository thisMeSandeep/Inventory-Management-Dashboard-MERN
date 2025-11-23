import { HttpError } from "../errors/httpError.js";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductService,
  updateProductService,
} from "../services/product.services.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/productValidation.js";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

// -------------------- Create a Product---------------------
export const createProduct = async (req: Request, res: Response) => {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({ success: false, message: errMessage });
    }

    // Use validated data
    const product = await createProductService(req, result.data);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ----------------------Get all  products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Call service to get all products
    const products = await getAllProductsService(req);
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      ...products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//----------------------- Update a product---------------------
export const updateProduct = async (req: Request, res: Response) => {
  // get product slug from params
  const { slug } = req.params;
  // get user id from req.user
  const userId = (req.user as JwtPayload).id;
  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    const errMessage = result.error.issues[0].message;
    return res.status(400).json({ success: false, message: errMessage });
  }
  try {
    const updatedProduct = await updateProductService(
      userId,
      slug,
      result.data,
      req
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// -------------------Delete a product---------------------
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = (req.user as JwtPayload).id;
    // Call service to delete product
    const deletedProduct = await deleteProductService(userId, slug);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ------------------ Get a single product ---------------------
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    // Call service to get single product
    const product = await getProductService(slug);
    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

