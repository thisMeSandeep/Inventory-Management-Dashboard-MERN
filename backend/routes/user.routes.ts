import express, { Router } from "express";
import {
  emailVerification,
  forgotPassword,
  loginUser,
  refreshToken,
  register,
  resetPassword,
} from "@/controllers/user.controller.js";

const router: Router = express.Router();


router.post("/register", register); //user registration
router.post("/email-verification", emailVerification); //email verification
router.post("/forgot-password", forgotPassword); //forgot password
router.post("/reset-password", resetPassword); //reset password
router.post("/login", loginUser); //user login
router.post("/refresh-token", refreshToken); //refresh token

export default router;
