import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginEmailPayload,
  RegisterEmailPayload,
  ResetPasswordPayload,
  WaitlistPayload,
} from "@/features/auth/interfaces/auth.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === "string") {
      return message[0];
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const loginWithEmail = async (
  payload: LoginEmailPayload,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      ApiRoutes.auth.email.login,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to sign in. Please check your credentials.",
      ),
    );
  }
};

export const registerWithEmail = async (
  payload: RegisterEmailPayload,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      ApiRoutes.auth.email.register,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to create account. Please try again.",
      ),
    );
  }
};

export const joinWaitlist = async (
  payload: WaitlistPayload,
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      ApiRoutes.auth.email.waitlist,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to join waitlist. Please try again."),
    );
  }
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      ApiRoutes.auth.forgotPassword,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to request password reset. Please try again.",
      ),
    );
  }
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      ApiRoutes.auth.resetPassword,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to reset password. Please try again."),
    );
  }
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      ApiRoutes.auth.changePassword,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to change password. Please try again.",
      ),
    );
  }
};
