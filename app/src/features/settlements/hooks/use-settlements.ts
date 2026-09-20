import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSettlementPayload) =>
      createSettlement(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      // The shares are no longer owed, so the distributions view is stale too.
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      toast.add({
        title: "Payment recorded",
        description: "The employee can see it and confirm they received it.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not record the payment",
        description: error.message,
        type: "error",
      });
    },
  });
};

// `showErrorToast: false` for callers that render the failure themselves, such
// as a confirmation dialog whose overlay would cover the toast.
export const useReverseSettlement = (options?: { showErrorToast?: boolean }) => {
  const showErrorToast = options?.showErrorToast ?? true;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reverseSettlement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      toast.add({
        title: "Payment reversed",
        description: "Those shares are owed again.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      if (!showErrorToast) return;
      toast.add({
        title: "Could not reverse the payment",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useConfirmSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmSettlement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settlementsQueryKeys.root,
      });
      toast.add({
        title: "Confirmed",
        description: "Thanks — your business can see you received it.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not confirm",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useExportStoreSettlementsCsv = (storeId: string) => {
  return useMutation({
    mutationFn: (query?: SettlementsExportQuery) =>
      exportStoreSettlementsCsv(storeId, query),
    onSuccess: () => {
      toast.add({ title: "Export ready", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not export",
        description: error.message,
        type: "error",
      });
    },
  });
};
