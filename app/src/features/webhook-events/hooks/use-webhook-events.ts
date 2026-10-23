import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listAdminWebhookEvents } from "@/features/webhook-events/services/webhook-events.services";
import type { AdminWebhookEventsQuery } from "@/features/webhook-events/interfaces/webhook-events.interfaces";

export const webhookEventsQueryKeys = {
  root: ["webhook-events"] as const,
  adminList: (query?: AdminWebhookEventsQuery) =>
    ["webhook-events", "admin", query] as const,
};

export const useAdminWebhookEvents = (query?: AdminWebhookEventsQuery) => {
  return useQuery({
    queryKey: webhookEventsQueryKeys.adminList(query),
    queryFn: () => listAdminWebhookEvents(query),
    placeholderData: keepPreviousData,
  });
};
