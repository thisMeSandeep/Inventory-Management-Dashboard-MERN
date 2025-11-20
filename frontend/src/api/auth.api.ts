import axiosInstance from "../lib/axios";

// --------------------register user------------------
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};
export const registerUser = (data: RegisterData) => {
  return axiosInstance.post("/user/register", data);
};

// --------------------verify email------------------
type VerifyEmailData = {
  email: string;
  token: number;
};

export const verifyEmail = (data: VerifyEmailData) => {
  return axiosInstance.post("/user/email-verification", data);
};

// --------------------resend verification email------------------
export const resendVerificationEmail = (email: string) => {
  return axiosInstance.post("/user/resend-verification", { email });
};

// --------------------login user------------------
type LoginData = {
  email: string;
  password: string;
};
export const loginUser = (data: LoginData) => {
  return axiosInstance.post("/user/login", data);
};

// --------------------forgot password------------------
type ForgotPasswordData = {
  email: string;
};
export const forgotPassword = (data: ForgotPasswordData) => {
  return axiosInstance.post("/user/forgot-password", data);
};

// --------------------reset password------------------
type ResetPasswordData = {
  email: string;
  token: number;
  password: string;
};
export const resetPassword = (data: ResetPasswordData) => {
  return axiosInstance.post("/user/reset-password", data);
};

// --------------------get current user------------------
export const getCurrentUser = () => {
  return axiosInstance.get("/user/me");
};

// --------------------logout user------------------
export const logoutUser = () => {
  return axiosInstance.post("/user/logout");
};
