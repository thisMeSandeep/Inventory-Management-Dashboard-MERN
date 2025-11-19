import { z } from 'zod';

// --- Register Schema ---
export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// --- Login Schema ---
export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// --- Email Verification Schema ---
export const emailVerificationSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  token: z.string()
    .length(6, { message: 'Token must be 6 digits' })
    .regex(/^\d+$/, { message: 'Token must contain only numbers' }),
});

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

// --- Forgot Password Schema ---
export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// --- Reset Password Schema ---
export const resetPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  token: z.string()
    .length(6, { message: 'Token must be 6 digits' })
    .regex(/^\d+$/, { message: 'Token must contain only numbers' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// --- OTP Verification Schema ---
export const otpSchema = z.object({
  otp: z.string()
    .length(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d+$/, { message: 'OTP must contain only numbers' }),
});

export type OtpFormData = z.infer<typeof otpSchema>;
