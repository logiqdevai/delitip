import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createDistributionRule,
  deleteDistributionRule,
  getDistributionRule,
  getDistributionRulePayoutModeImpact,
  listDistributionRules,
  setDefaultDistributionRule,
  updateDistributionRule,
} from "@/features/distribution/services/distribution.services";
import type {
  CreateDistributionRulePayload,
  SetDefaultDistributionRulePayload,
  UpdateDistributionRulePayload,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { storesQueryKeys } from "@/features/stores/hooks/use-stores";
import { usersQueryKeys } from "@/features/users/hooks/use-users";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const distributionQueryKeys = {
  root: ["distribution-rules"] as const,
  list: (storeId: string) => ["distribution-rules", storeId] as const,
  detail: (id: string) => ["distribution-rule", id] as const,
  payoutModeImpact: (id: string) =>
    ["distribution-rule", id, "payout-mode-impact"] as const,
};

export const useDistributionRules = (storeId: string) => {
  return useQuery({
    queryKey: distributionQueryKeys.list(storeId),
    queryFn: () => listDistributionRules(storeId),
    enabled: !!storeId,
  });
};

export const useDistributionRule = (id: string) => {
  return useQuery({
    queryKey: distributionQueryKeys.detail(id),
    queryFn: () => getDistributionRule(id),
    enabled: !!id,
  });
};

// How many pending shares a payout-mode switch would move, so the rule editor
// can say what it's about to do before the owner commits to it.
export const useDistributionRulePayoutModeImpact = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: distributionQueryKeys.payoutModeImpact(id),
    queryFn: () => getDistributionRulePayoutModeImpact(id),
    enabled: !!id && (options?.enabled ?? true),
  });
};

export const useCreateDistributionRule = (storeId: string) => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.distribution.toast");

  return useMutation({
    mutationFn: (payload: CreateDistributionRulePayload) =>
      createDistributionRule(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.distributionRuleCreated, { store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      toast.add({
        title: t("createdTitle"),
        description: t("createdDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("createFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useUpdateDistributionRule = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.distribution.toast");

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDistributionRulePayload;
    }) => updateDistributionRule(id, payload),
    onSuccess: (data, variables) => {
      trackEvent(AnalyticsEvents.distributionRuleUpdated);
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.detail(variables.id),
      });
      // A mode switch takes pending shares with it, so say so rather than
      // leaving the owner to discover it on the next payout run.
      const rerouted = data?.rerouted_distributions_count ?? 0;
      toast.add({
        title: t("updatedTitle"),
        description:
          rerouted > 0
            ? t("updatedReroutedDescription", { count: rerouted })
            : t("updatedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("updateFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

// `showErrorToast: false` for callers that render the failure themselves, such
// as a confirmation dialog whose overlay would cover the toast.
export const useDeleteDistributionRule = (options?: {
  showErrorToast?: boolean;
}) => {
  const showErrorToast = options?.showErrorToast ?? true;
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.distribution.toast");

  return useMutation({
    mutationFn: (id: string) => deleteDistributionRule(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.distributionRuleDeleted);
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      toast.add({
        title: t("deletedTitle"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      if (!showErrorToast) return;
      toast.add({
        title: t("deleteFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useSetDefaultDistributionRule = (storeId: string) => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.distribution.toast");

  return useMutation({
    mutationFn: (payload: SetDefaultDistributionRulePayload) =>
      setDefaultDistributionRule(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.distributionRuleSetDefault, { store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.accounts });
      toast.add({
        title: t("defaultUpdatedTitle"),
        description: t("defaultUpdatedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("defaultFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
