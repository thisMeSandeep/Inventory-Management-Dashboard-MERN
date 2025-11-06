import { z } from "zod";
import jwt from "jsonwebtoken";
import {
  login,
  passwordForgot,
  passwordReset,
  registerUser,
  verifyEmail,
} from "@/services/user.services.js";
import { userValidation } from "@/validations/userValidation.js";
import { Request, Response } from "express";
import { HttpError } from "@/errors/httpError.js";
import { generateJwtToken } from "@/utils/generateJwtToken.js";
import { cookieOptions } from "@/constants/cookieOption.js";

// ---------------- Register controller-----------------

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = userValidation.safeParse({ name, email, password });
    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({ success: false, message: pretty });
    }

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Check your email for verification token.",
      user,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ------------------------ email verification controller -----------------------

export const emailVerification = async (req: Request, res: Response) => {
  const validation = z.object({
    email: z.email({ error: "Invalid email format" }),
    token: z.number(),
  });
  try {
    const { email, token } = req.body;

    const result = validation.safeParse({ email, token });

    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({
        success: false,
        message: pretty,
      });
    }

    const response = await verifyEmail(email, token);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Email Verification Error:", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ----------------------forgot password controller -----------------------
export const forgotPassword = async (req: Request, res: Response) => {
  const validation = z.object({
    email: z.email({ error: "Invalid email format" }),
  });
  try {
    const { email } = req.body;
    const result = validation.safeParse({ email });

    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({
        success: false,
        message: pretty,
      });
    }

    const response = await passwordForgot(email);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Forgot Password Error", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//------------------------Reset password controller -----------------------
export const resetPassword = async (req: Request, res: Response) => {
  const validation = z.object({
    email: z.email({ error: "Invalid email format" }),
    token: z.number(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  try {
    const { email, token, password } = req.body;
    const result = validation.safeParse({ email, token, password });

    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({
        success: false,
        message: pretty,
      });
    }

    const response = await passwordReset(email, token, password);

    return res.status(200).json(response);
  } catch (error:any) {
    console.error("reset Password Error", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//--------------------- Login user controller----------------------
export const loginUser = async (req: Request, res: Response) => {
  const validation = z.object({
    email: z.email({ error: "Invalid email format" }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  try {
    const { email, password } = req.body;

    const result = validation.safeParse({ email, password });

    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      return res.status(400).json({
        success: false,
        message: pretty,
      });
    }

    const response = await login(email, password, res);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("login Error", error);

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    // For unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//------------------------ refresh access token controller -----------------------

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token expired" });
      }
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const { id, role } = decoded;

    const newAccessToken = generateJwtToken(
      id,
      role,
      process.env.ACCESS_TOKEN_EXPIRY
    );

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error:any) {
    console.error("Refresh Token Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
