import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  AdminWebhookEventsQuery,
  WebhookEvent,
} from "@/features/webhook-events/interfaces/webhook-events.interfaces";

export const listAdminWebhookEvents = async (
  query?: AdminWebhookEventsQuery,
): Promise<PaginatedResponse<WebhookEvent>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<WebhookEvent>>(
      ApiRoutes.admin.webhookEvents.prefix,
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load webhook events. Please try again.");
  }
};
