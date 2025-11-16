import User from "@/models/user.model.js";
import { emailVerificationTemplate } from "@/templates/emailVerification.js";
import { generateToken } from "@/utils/generateToken.js";
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
import redis from "@/config/redis.js";

//--------------- Register user ---------------
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
  });

  if (!user) throw new Error("Failed to create user");

  // save token and expiry in redis
  await redis.set(`emailVerificationToken:${email}`, token, { EX: 10 * 60 });

  const mailRes = await sendMail({
    to: email,
    subject: "Email Verification",
    text: `Your email verification token is ${token}`,
    html: emailVerificationTemplate(token, name, 10),
  });

  if (!mailRes) throw new Error("Failed to send verification email");

  return { email: user.email };
};

//-------------------- Verify email ---------------
export const verifyEmail = async (email: string, token: number) => {
  // check if email exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User with this email not found");
  }

  // check if email is already verified
  if (user.isVerified) {
    throw new BadRequestError("Email is already verified");
  }

  // get token from redis
  const savedToken = await redis.get(`emailVerificationToken:${email}`);

  if (!savedToken) {
    throw new BadRequestError("Verification token has expired");
  }

  // check if token is valid
  if (savedToken !== token.toString()) {
    throw new BadRequestError("Invalid verification token");
  }

  // update user
  user.isVerified = true;
  await user.save();

  // delete token from redis
  await redis.del(`emailVerificationToken:${email}`);

  return {
    success: true,
    message: "Email verified successfully",
  };
};

//--------------- forgot password ---------------
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

  // save token in redis for 10 minutes
  await redis.set(`passwordResetToken:${email}`, token, { EX: 10 * 60 });

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

//--------------- reset password ---------------
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

  // get token from redis
  const savedToken = await redis.get(`passwordResetToken:${email}`);
  if (!savedToken) {
    throw new BadRequestError("Password reset token has expired");
  }
  // check if token is valid
  if (savedToken !== token.toString()) {
    throw new BadRequestError("Invalid password reset token");
  }

  // update user
  user.password = password;
  await user.save();

  // delete token from redis
  await redis.del(`passwordResetToken:${email}`);

  return {
    success: true,
    message: "Your password has been reset successfully",
  };
};

//--------------- login ---------------
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
    process.env.ACCESS_TOKEN_EXPIRY!
  );

  res.cookie("accessToken", accessToken, cookieOptions);

  const refreshToken = generateJwtToken(
    user._id,
    user.role,
    process.env.REFRESH_TOKEN_EXPIRY!
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
