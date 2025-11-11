import { HttpError } from "@/errors/httpError.js";
import { createProductService } from "@/services/product.services.js";
import { createProductSchema } from "@/validations/productvalidation.js";
import { Request, Response } from "express";

// -------------------- Create a Product---------------------
export const createProduct = async (req: Request, res: Response) => {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({ success: false, message: errMessage });
    }

    // Use validated data (with parsed tags) instead of raw req.body
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
