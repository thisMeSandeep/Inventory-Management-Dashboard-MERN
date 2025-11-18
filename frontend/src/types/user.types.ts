export type UserRole = "admin" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth Request/Response Types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    email: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface EmailVerificationInput {
  email: string;
  token: number;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordInput {
  email: string;
  token: number;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface GetCurrentUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}
