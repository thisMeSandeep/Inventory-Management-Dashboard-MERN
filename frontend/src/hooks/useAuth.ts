import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser, verifyEmail, resendVerificationEmail, loginUser, forgotPassword, resetPassword, type RegisterData } from "../api/auth.api";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "../store/user.store";

//  register hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => registerUser(userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(response.data.message || "Registration successful!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

// email verification hook
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; token: number }) => verifyEmail(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(response.data.message || "Email verified successfully!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Email verification failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

// resend verification email hook
export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (response) => {
      toast.success(response.data.message || "Verification email sent successfully!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to resend verification email. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};


// login hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
    onSuccess: (response) => {
      const user = response.data.user;
      setUser(user);
      queryClient.setQueryData(["currentUser"], user);
      toast.success(response.data.message || "Login successful!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Login failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

// forgot password hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Reset code sent to your email!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send reset code. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

// reset password hook
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; token: number; password: string }) => resetPassword(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(response.data.message || "Password reset successful!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to reset password. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
};

