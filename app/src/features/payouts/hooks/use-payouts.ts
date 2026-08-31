import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listEmployeePayouts,
  listStorePayouts,
  runStorePayouts,
} from "@/features/payouts/services/payouts.services";
import type {
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

export const useRunStorePayouts = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RunPayoutPayload) => runStorePayouts(storeId, payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
      // A run moves distributions out of "pending" — the tips list (which
      // pending-distributions-panel derives its held/eligible view from)
      // needs to reflect that too.
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
            ? `${skippedCount} recipient${skippedCount === 1 ? "" : "s"} skipped — see details below.`
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
