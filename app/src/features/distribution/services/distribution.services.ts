import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateDistributionRulePayload,
  DistributionRule,
  SetDefaultDistributionRulePayload,
  UpdateDistributionRulePayload,
} from "@/features/distribution/interfaces/distribution.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  }
  return fallback;
};

export const listDistributionRules = async (
  storeId: string,
): Promise<DistributionRule[]> => {
  try {
    const response = await axiosInstance.get<DistributionRule[]>(
      ApiRoutes.stores.distributionRules(storeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load distribution rules. Please try again.");
  }
};

export const getDistributionRule = async (
  id: string,
): Promise<DistributionRule> => {
  try {
    const response = await axiosInstance.get<DistributionRule>(
      ApiRoutes.distributionRules.byId(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load distribution rule. Please try again.");
  }
};

export const createDistributionRule = async (
  storeId: string,
  payload: CreateDistributionRulePayload,
): Promise<DistributionRule> => {
  try {
    const response = await axiosInstance.post<DistributionRule>(
      ApiRoutes.stores.distributionRules(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to create distribution rule. Please try again."),
    );
  }
};

export const updateDistributionRule = async (
  id: string,
  payload: UpdateDistributionRulePayload,
): Promise<DistributionRule> => {
  try {
    const response = await axiosInstance.patch<DistributionRule>(
      ApiRoutes.distributionRules.byId(id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update distribution rule. Please try again."),
    );
  }
};

export const deleteDistributionRule = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.distributionRules.byId(id));
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to delete distribution rule. Please try again."),
    );
  }
};

export const setDefaultDistributionRule = async (
  storeId: string,
  payload: SetDefaultDistributionRulePayload,
): Promise<void> => {
  try {
    await axiosInstance.patch(
      ApiRoutes.stores.defaultDistributionRule(storeId),
      payload,
    );
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to set default distribution rule. Please try again."),
    );
  }
};
