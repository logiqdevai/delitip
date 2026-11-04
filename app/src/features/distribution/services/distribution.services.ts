import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateDistributionRulePayload,
  DistributionRule,
  DistributionRulePayoutModeImpact,
  SetDefaultDistributionRulePayload,
  UpdateDistributionRulePayload,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

export const listDistributionRules = async (
  storeId: string,
): Promise<DistributionRule[]> => {
  try {
    const response = await axiosInstance.get<DistributionRule[]>(
      ApiRoutes.stores.distributionRules(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "We couldn't load distribution rules. Please try again."));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "We couldn't load distribution rule. Please try again."));
  }
};

export const getDistributionRulePayoutModeImpact = async (
  id: string,
): Promise<DistributionRulePayoutModeImpact> => {
  try {
    const response = await axiosInstance.get<DistributionRulePayoutModeImpact>(
      ApiRoutes.distributionRules.payoutModeImpact(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "We couldn't check what this change affects. Please try again."));
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
      getApiErrorMessage(error, "We couldn't create distribution rule. Please try again."),
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
      getApiErrorMessage(error, "We couldn't update distribution rule. Please try again."),
    );
  }
};

export const deleteDistributionRule = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.distributionRules.byId(id));
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't delete distribution rule. Please try again."),
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
      getApiErrorMessage(error, "We couldn't set default distribution rule. Please try again."),
    );
  }
};
