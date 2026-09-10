import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPayout,
  listAdminPayouts,
  listEmployeePayouts,
  listStoreDistributions,
  listStorePayouts,
  previewStorePayouts,
  runStorePayouts,
} from "@/features/payouts/services/payouts.services";
import type {
  AdminPayoutsQuery,
  DistributionsQuery,
  PayoutsQuery,
  RunPayoutPayload,
} from "@/features/payouts/interfaces/payouts.interfaces";
import { tipsQueryKeys } from "@/features/tips/hooks/use-tips";
import { toast } from "@/components/ui/toast";

export const payoutsQueryKeys = {
  root: ["payouts"] as const,
  storeList: (storeId: string, query?: PayoutsQuery) =>
    ["payouts", "store", storeId, query] as const,
  employeeList: (employeeId: string, query?: PayoutsQuery) =>
    ["payouts", "employee", employeeId, query] as const,
  adminList: (query?: AdminPayoutsQuery) =>
    ["payouts", "admin", query] as const,
  adminDetail: (id: string) => ["payout", "admin", id] as const,
  storePreview: (storeId: string) => ["payouts", "preview", storeId] as const,
};

export const distributionsQueryKeys = {
  root: ["distributions"] as const,
  storeList: (storeId: string, query?: DistributionsQuery) =>
    ["distributions", "store", storeId, query] as const,
};

export const useStoreDistributions = (
  storeId: string,
  query?: DistributionsQuery,
) => {
  return useQuery({
    queryKey: distributionsQueryKeys.storeList(storeId, query),
    queryFn: () => listStoreDistributions(storeId, query),
    enabled: !!storeId,
  });
};

export const useStorePayouts = (storeId: string, query?: PayoutsQuery) => {
  return useQuery({
    queryKey: payoutsQueryKeys.storeList(storeId, query),
    queryFn: () => listStorePayouts(storeId, query),
    enabled: !!storeId,
  });
};

export const useEmployeePayouts = (
  employeeId: string,
  query?: PayoutsQuery,
) => {
  return useQuery({
    queryKey: payoutsQueryKeys.employeeList(employeeId, query),
    queryFn: () => listEmployeePayouts(employeeId, query),
    enabled: !!employeeId,
  });
};

export const useAdminPayouts = (query?: AdminPayoutsQuery) => {
  return useQuery({
    queryKey: payoutsQueryKeys.adminList(query),
    queryFn: () => listAdminPayouts(query),
  });
};

export const useAdminPayout = (id: string) => {
  return useQuery({
    queryKey: payoutsQueryKeys.adminDetail(id),
    queryFn: () => getAdminPayout(id),
    enabled: !!id,
  });
};

// Enabled only while the "Pay out now" dialog is open (`enabled`) — refetches
// fresh every time it opens rather than serving a stale cached breakdown.
export const useStorePayoutsPreview = (storeId: string, enabled: boolean) => {
  return useQuery({
    queryKey: payoutsQueryKeys.storePreview(storeId),
    queryFn: () => previewStorePayouts(storeId),
    enabled: !!storeId && enabled,
  });
};

export const useRunStorePayouts = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RunPayoutPayload) => runStorePayouts(storeId, payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: distributionsQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: tipsQueryKeys.root });

      const paidCount = result.payouts.filter((p) => p.status !== "FAILED").length;
      const skippedCount = result.skipped_recipients.length;

      if (paidCount === 0 && skippedCount === 0) {
        toast.add({
          title: "Nothing to pay out",
          description: "No distributions are eligible right now.",
          type: "success",
        });
        return;
      }

      toast.add({
        title: `${paidCount} payout${paidCount === 1 ? "" : "s"} started`,
        description:
          skippedCount > 0
            ? `${skippedCount} recipient${skippedCount === 1 ? "" : "s"} skipped - see details below.`
            : undefined,
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not run payouts",
        description: error.message,
        type: "error",
      });
    },
  });
};
