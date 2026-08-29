import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  UpdateUserPayload,
  UserAccounts,
  UserProfile,
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
