import { tr } from "@/lib/i18n-runtime";
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
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

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
        tr("errors.services.signIn"),
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
        tr("errors.services.createAccount"),
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
      getApiErrorMessage(error, tr("errors.services.joinWaitlist")),
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
        tr("errors.services.requestPasswordReset"),
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
      getApiErrorMessage(error, tr("errors.services.resetPassword")),
    );
  }
};

export const getResetTokenInfo = async (
  token: string,
): Promise<{ email: string }> => {
  try {
    const response = await axiosInstance.get<{ email: string }>(
      ApiRoutes.auth.resetPasswordInfo,
      { params: { token } },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, tr("errors.services.linkExpired")),
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
        tr("errors.services.changePassword"),
      ),
    );
  }
};
