import { z } from "zod";
import jwt from "jsonwebtoken";
import {
  login,
  passwordForgot,
  passwordReset,
  registerUser,
  verifyEmail,
  resendVerificationEmail,
} from "@/services/user.services.js";
import { userValidation } from "@/validations/userValidation.js";
import { Request, Response } from "express";
import { HttpError } from "@/errors/httpError.js";
import { generateJwtToken } from "@/utils/generateJwtToken.js";
import { getCookieOptions } from "@/constants/cookieOption.js";
import User from "@/models/user.model.js";
import redis from "@/config/redis.js";

// ---------------- Register controller-----------------

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = userValidation.safeParse({ name, email, password });
    if (!result.success) {
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({ success: false, message: errMessage });
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
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: errMessage,
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

// ----------------------resend verification email controller -----------------------
export const resendVerification = async (req: Request, res: Response) => {
  const validation = z.object({
    email: z.email({ error: "Invalid email format" }),
  });
  try {
    const { email } = req.body;

    const result = validation.safeParse({ email });

    if (!result.success) {
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: errMessage,
      });
    }

    const response = await resendVerificationEmail(email);

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Resend Verification Error:", error);

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
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: errMessage,
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
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: errMessage,
      });
    }

    const response = await passwordReset(email, token, password);

    return res.status(200).json(response);
  } catch (error: any) {
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
      const errMessage = result.error.issues[0].message;
      return res.status(400).json({
        success: false,
        message: errMessage,
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

// ------------------------- get current user controller ----------------------
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;

    // if access token is valid , return user
    if (accessToken) {
      try {
        // decode token
        const decoded = jwt.verify(
          accessToken,
          process.env.JWT_SECRET_KEY!
        ) as jwt.JwtPayload;

        // Check Redis cache first
        const cachedUser = await redis.get(`user:${decoded.id}`);
        if (cachedUser) {
          return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: JSON.parse(cachedUser),
          });
        }

        // get the user from database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        // Cache user data for 30 minutes
        await redis.set(`user:${user._id}`, JSON.stringify(userData), {
          EX: 30 * 60,
        });

        return res.status(200).json({
          success: true,
          message: "User retrieved successfully",
          data: userData,
        });
      } catch (err) {
        // Access token invalid/expired, fall through to refresh token
        console.log("Access token invalid, trying refresh token");
      }
    }

    // use refresh token if access token is not present or expired
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_KEY!
      ) as jwt.JwtPayload;

      // Check Redis cache first
      const cachedUser = await redis.get(`user:${decoded.id}`);
      if (cachedUser) {
        // create a new access token
        const newAccessToken = generateJwtToken(
          decoded.id,
          decoded.role,
          process.env.ACCESS_TOKEN_EXPIRY!
        );
        res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));

        return res.status(200).json({
          success: true,
          message: "User retrieved successfully",
          data: JSON.parse(cachedUser),
        });
      }

      // get the user from database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Cache user data for 30 minutes
      await redis.set(`user:${user._id}`, JSON.stringify(userData), {
        EX: 30 * 60,
      });

      // create a new access token
      const newAccessToken = generateJwtToken(
        user._id,
        user.role,
        process.env.ACCESS_TOKEN_EXPIRY!
      );
      res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: userData,
      });
    } catch (err: any) {
      // Handle refresh token errors
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token expired" });
      }
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
  } catch (error: any) {
    console.error("Get Current User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//------------------logout user controller ----------------------
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Get user Id from token before clearing cookies
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.JWT_SECRET_KEY!
        ) as jwt.JwtPayload;
        // Clear user cache from Redis
        await redis.del(`user:${decoded.id}`);
      } catch (err) {
        console.log("Error clearing user cache from Redis:", err);
      }
    }

    res.clearCookie("accessToken", getCookieOptions(0));
    res.clearCookie("refreshToken", getCookieOptions(0));
    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
