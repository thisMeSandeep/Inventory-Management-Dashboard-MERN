import { userValidation } from "@/validations/userValidation.js";
import { Request, Response } from "express";
import { z } from "zod";

// ---------------- Register controller-----------------

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

  
  // validate using zod
    const result = userValidation.safeParse({ name, email, password });

    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({
        success: false,
        message: pretty,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
