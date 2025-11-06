import User from "@/models/user.model.js";
import { emailVarificationTemplate } from "@/templates/emailVarification.js";
import { generateToken } from "@/utils/generateToke.js";
import { sendMail } from "@/utils/sendMail.js";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "@/errors/httpError.js";
import { forgotPasswordTemplate } from "@/templates/forgotPasswordTemplate.js";
import { generateJwtToken } from "@/utils/generateJwtToken.js";
import { Response } from "express";
import { cookieOptions } from "@/constants/cookieOption.js";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ConflictError("User with this email already exists");

  const token = generateToken();

  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: token,
    emailVerificationTokenExpiry: Date.now() + 10 * 60 * 1000,
  });

  if (!user) throw new Error("Failed to create user in the database");

  const mailRes = await sendMail({
    to: email,
    subject: "Email Verification",
    text: `Your email verification token is ${token}`,
    html: emailVarificationTemplate(token, name, 10),
  });

  if (!mailRes) throw new Error("Failed to send verification email");

  return { email: user.email };
};

export const verifyEmail = async (email: string, token: number) => {
  // check if email exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  // check if token is valid
  if (user.emailVerificationToken !== token) {
    throw new BadRequestError("Invalid verification token");
  }

  // check token expiry
  if (user.emailVerificationTokenExpiry < Date.now()) {
    throw new BadRequestError("Verification token has expired");
  }

  // update user
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save();

  return {
    success: true,
    message: "Email verified successfully",
  };
};

export const passwordForgot = async (email: string) => {
  //  check if email exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  // check if email is verified
  if (!user.isVerified) {
    throw new BadRequestError(
      "Email is not verified , please verify your email"
    );
  }

  const token = generateToken();

  // update user
  user.passwordResetToken = token;
  user.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  const mailRes = await sendMail({
    to: email,
    subject: "Password Reset",
    text: `Your password reset token is ${token}`,
    html: forgotPasswordTemplate(token, user.name, 10),
  });

  if (!mailRes) throw new Error("Failed to send verification email");

  return {
    success: true,
    message: "Password reset token sent successfully",
  };
};

export const passwordReset = async (
  email: string,
  token: number,
  password: string
) => {
  //  check if email exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  // check if email is verified
  if (!user.isVerified) {
    throw new BadRequestError(
      "Email is not verified , please verify your email"
    );
  }

  // check if token is valid
  if (user.passwordResetToken !== token) {
    throw new BadRequestError("Invalid reset token");
  }

  // check token expiry
  if (user.passwordResetTokenExpiry < Date.now()) {
    throw new BadRequestError("Reset token has expired");
  }

  // update user
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;
  await user.save();

  return {
    success: true,
    message: "Your password has been reset successfully",
  };
};

export const login = async (email: string, password: string, res: Response) => {
  // check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  // check if email is verified
  if (!user.isVerified) {
    throw new BadRequestError(
      "Email is not verified , please verify your email"
    );
  }

  // check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid password");
  }

  // save access token and refresh token in cookies
  const accessToken = generateJwtToken(
    user._id,
    user.role,
    process.env.ACCESS_TOKEN_EXPIRY
  );

  res.cookie("accessToken", accessToken, cookieOptions);

  const refreshToken = generateJwtToken(
    user._id,
    user.role,
    process.env.REFRESH_TOKEN_EXPIRY
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return {
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
