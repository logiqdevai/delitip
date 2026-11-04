import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  confirmSettlement,
  createSettlement,
  exportStoreSettlementsCsv,
  getEmployeeSettlementBalance,
  getStoreSettlementBalances,
  listEmployeeSettlements,
  listOwedDistributions,
  listProposedAdjustments,
  listStoreSettlements,
  reverseSettlement,
} from "@/features/settlements/services/settlements.services";
import type {
  CreateSettlementPayload,
  OwedDistributionsQuery,
  SettlementBalancesQuery,
  SettlementsExportQuery,
  SettlementsQuery,
} from "@/features/settlements/interfaces/settlements.interfaces";
import { payoutsQueryKeys } from "@/features/payouts/hooks/use-payouts";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const settlementsQueryKeys = {
  root: ["settlements"] as const,
  balances: (storeId: string, query?: SettlementBalancesQuery) =>
    ["settlements", "balances", storeId, query] as const,
  owedDistributions: (storeId: string, query: OwedDistributionsQuery) =>
    ["settlements", "owed", storeId, query] as const,
  adjustments: (storeId: string, employeeId: string) =>
    ["settlements", "adjustments", storeId, employeeId] as const,
  storeList: (storeId: string, query?: SettlementsQuery) =>
    ["settlements", "store", storeId, query] as const,
  employeeList: (employeeId: string, query?: SettlementsQuery) =>
    ["settlements", "employee", employeeId, query] as const,
  employeeBalance: (employeeId: string) =>
    ["settlements", "employee-balance", employeeId] as const,
};

export const useStoreSettlementBalances = (
  storeId: string,
  query?: SettlementBalancesQuery,
) => {
  return useQuery({
    queryKey: settlementsQueryKeys.balances(storeId, query),
    queryFn: () => getStoreSettlementBalances(storeId, query),
    enabled: !!storeId,
  });
};

export const useOwedDistributions = (
  storeId: string,
  query: OwedDistributionsQuery,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: settlementsQueryKeys.owedDistributions(storeId, query),
    queryFn: () => listOwedDistributions(storeId, query),
    enabled: !!storeId && !!query.employee_id && (options?.enabled ?? true),
  });
};

export const useProposedAdjustments = (
  storeId: string,
  employeeId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: settlementsQueryKeys.adjustments(storeId, employeeId),
    queryFn: () => listProposedAdjustments(storeId, employeeId),
    enabled: !!storeId && !!employeeId && (options?.enabled ?? true),
  });
};

export const useStoreSettlements = (
  storeId: string,
  query?: SettlementsQuery,
) => {
  return useQuery({
    queryKey: settlementsQueryKeys.storeList(storeId, query),
    queryFn: () => listStoreSettlements(storeId, query),
    enabled: !!storeId,
  });
};

export const useEmployeeSettlements = (
  employeeId: string,
  query?: SettlementsQuery,
) => {
  return useQuery({
    queryKey: settlementsQueryKeys.employeeList(employeeId, query),
    queryFn: () => listEmployeeSettlements(employeeId, query),
    enabled: !!employeeId,
  });
};

export const useEmployeeSettlementBalance = (employeeId: string) => {
  return useQuery({
    queryKey: settlementsQueryKeys.employeeBalance(employeeId),
    queryFn: () => getEmployeeSettlementBalance(employeeId),
    enabled: !!employeeId,
  });
};

export const useCreateSettlement = (storeId: string) => {
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSettlementPayload) =>
      createSettlement(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.settlementCreated, { store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      // The shares are no longer owed, so the distributions view is stale too.
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      toast.add({
        title: t("settlements.recordedTitle"),
        description: t("settlements.recordedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("settlements.recordFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

// `showErrorToast: false` for callers that render the failure themselves, such
// as a confirmation dialog whose overlay would cover the toast.
export const useReverseSettlement = (options?: { showErrorToast?: boolean }) => {
  const showErrorToast = options?.showErrorToast ?? true;
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reverseSettlement(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.settlementReversed);
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      toast.add({
        title: t("settlements.reversedTitle"),
        description: t("settlements.reversedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      if (!showErrorToast) return;
      toast.add({
        title: t("settlements.reverseFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useConfirmSettlement = () => {
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmSettlement(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.settlementConfirmed);
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      toast.add({
        title: t("settlements.confirmedTitle"),
        description: t("settlements.confirmedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("settlements.confirmFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useExportStoreSettlementsCsv = (storeId: string) => {
  const t = useTranslations("dashboard.money.toasts");
  return useMutation({
    mutationFn: (query?: SettlementsExportQuery) =>
      exportStoreSettlementsCsv(storeId, query),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.settlementsExported, { store_id: storeId });
      toast.add({ title: t("settlements.exportReady"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("settlements.exportFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
