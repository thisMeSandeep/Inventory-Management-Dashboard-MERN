import express, { Router } from "express";
import {
  emailVerification,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  register,
  resetPassword,
  resendVerification,
} from "@/controllers/user.controller.js";
import { authLimiter } from "@/middlewares/rateLimiter.js";

const router: Router = express.Router();

router.post("/register", register); //user registration
router.post("/email-verification", emailVerification); //email verification
router.post("/resend-verification", resendVerification); //resend verification email
router.post("/forgot-password", authLimiter, forgotPassword); //forgot password
router.post("/reset-password", authLimiter, resetPassword); //reset password
router.post("/login", authLimiter, loginUser); //user login
router.get("/me", getCurrentUser); //get current user (auto-login)
router.post("/logout", logoutUser); //logout user

export default router;
