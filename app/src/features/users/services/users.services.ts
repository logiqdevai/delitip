import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  DeleteUserResult,
  UpdateUserPayload,
  UserAccounts,
  UserProfile,
  UsersQuery,
} from "@/features/users/interfaces/users.interfaces";

export const getMe = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get<UserProfile>(ApiRoutes.users.me);
    return response.data;
  } catch {
    throw new Error("Failed to load your profile. Please try again.");
  }
};

export const updateMe = async (
  payload: UpdateUserPayload,
): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.patch<UserProfile>(
      ApiRoutes.users.me,
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update your profile. Please try again.");
  }
};

export const listUsers = async (
  query?: UsersQuery,
): Promise<PaginatedResponse<UserProfile>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<UserProfile>>(
      ApiRoutes.users.prefix,
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load users. Please try again.");
  }
};

export const deleteUser = async (id: string): Promise<DeleteUserResult> => {
  try {
    const response = await axiosInstance.delete<DeleteUserResult>(
      ApiRoutes.users.byId(id),
    );
    return response.data;
  } catch (error) {
    // The API explains why a delete is refused (own account, protected role,
    // payout invoice in use), so surface its message instead of a generic one.
    const message = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    throw new Error(
      typeof message === "string" && message
        ? message
        : "Failed to delete the user. Please try again.",
    );
  }
};

export const getMyAccounts = async (): Promise<UserAccounts> => {
  try {
    const response = await axiosInstance.get<UserAccounts>(
      ApiRoutes.users.meAccounts,
    );
    return response.data;
  } catch {
    throw new Error("Failed to load your accounts. Please try again.");
  }
};
