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

router.post("/register", register);
router.post("/email-verification", emailVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

export default router;
