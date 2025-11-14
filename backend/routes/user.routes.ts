import express, { Router } from "express";
import {
  emailVerification,
  forgotPassword,
  loginUser,
  refreshToken,
  register,
  resetPassword,
} from "@/controllers/user.controller.js";
import { authLimiter } from "@/middlewares/rateLimiter.js";

const router: Router = express.Router();

router.post("/register", register); //user registration
router.post("/email-verification", emailVerification); //email verification
router.post("/forgot-password", authLimiter, forgotPassword); //forgot password
router.post("/reset-password", authLimiter, resetPassword); //reset password
router.post("/login", authLimiter, loginUser); //user login
router.post("/refresh-token", authLimiter, refreshToken); //refresh token

export default router;
