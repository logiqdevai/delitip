import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  changeSubscriptionPlan,
  getSubscription,
} from "@/features/subscriptions/services/subscriptions.services";
import type { UpdateSubscriptionPayload } from "@/features/subscriptions/interfaces/subscriptions.interfaces";
import { toast } from "@/components/ui/toast";

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
      void queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.detail(organizationId),
      });
      toast.add({ title: "Plan updated", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not change plan", description: error.message, type: "error" });
    },
  });
};

export const useCancelSubscription = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSubscription(organizationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: subscriptionsQueryKeys.detail(organizationId),
      });
      toast.add({ title: "Subscription canceled", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not cancel subscription", description: error.message, type: "error" });
    },
  });
};
