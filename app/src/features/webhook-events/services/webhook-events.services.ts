import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  AdminWebhookEventsQuery,
  WebhookEvent,
} from "@/features/webhook-events/interfaces/webhook-events.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const listAdminWebhookEvents = async (
  query?: AdminWebhookEventsQuery,
): Promise<PaginatedResponse<WebhookEvent>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<WebhookEvent>>(
      ApiRoutes.admin.webhookEvents.prefix,
      { params: query },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't load webhook events. Please try again."));
  }
};
