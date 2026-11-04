import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  changeSubscriptionPlan,
  getSubscription,
} from "@/features/subscriptions/services/subscriptions.services";
import type { UpdateSubscriptionPayload } from "@/features/subscriptions/interfaces/subscriptions.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const subscriptionsQueryKeys = {
  detail: (organizationId: string) => ["subscription", organizationId] as const,
};

export const useSubscription = (organizationId: string) => {
  return useQuery({
    queryKey: subscriptionsQueryKeys.detail(organizationId),
    queryFn: () => getSubscription(organizationId),
    enabled: !!organizationId,
  });
};

export const useChangeSubscriptionPlan = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) =>
      changeSubscriptionPlan(organizationId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.subscriptionPlanChanged, { organization_id: organizationId });
      void queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.detail(organizationId),
      });
      toast.add({ title: "Plan updated", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not change plan", description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useCancelSubscription = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSubscription(organizationId),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.subscriptionCancelled, { organization_id: organizationId });
      void queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.detail(organizationId),
      });
      toast.add({ title: "Subscription canceled", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not cancel subscription", description: getErrorMessage(error), type: "error" });
    },
  });
};
