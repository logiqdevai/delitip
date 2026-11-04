import { tr } from "@/lib/i18n-runtime";
import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  Subscription,
  UpdateSubscriptionPayload,
} from "@/features/subscriptions/interfaces/subscriptions.interfaces";
import { getErrorMessage } from "@/lib/api-error";

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
    throw new Error(getErrorMessage(error, tr("errors.services.loadSubscription")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.changePlan")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.cancelSubscription")));
  }
};
