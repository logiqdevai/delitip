import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  Subscription,
  UpdateSubscriptionPayload,
} from "@/features/subscriptions/interfaces/subscriptions.interfaces";

export const getSubscription = async (
  organizationId: string,
): Promise<Subscription | null> => {
  try {
    const response = await axiosInstance.get<Subscription>(
      ApiRoutes.organizations.subscription(organizationId),
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error("Failed to load subscription. Please try again.");
  }
};

export const changeSubscriptionPlan = async (
  organizationId: string,
  payload: UpdateSubscriptionPayload,
): Promise<Subscription> => {
  try {
    const response = await axiosInstance.patch<Subscription>(
      ApiRoutes.organizations.subscription(organizationId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to change plan. Please try again.");
  }
};

export const cancelSubscription = async (
  organizationId: string,
): Promise<Subscription> => {
  try {
    const response = await axiosInstance.post<Subscription>(
      ApiRoutes.organizations.subscriptionCancel(organizationId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to cancel subscription. Please try again.");
  }
};
