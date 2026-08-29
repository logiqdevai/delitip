import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPublicRefundRequest,
  createRefund,
  getRefund,
  listRefunds,
  updateRefund,
} from "@/features/refunds/services/refunds.services";
import type {
  CreatePublicRefundRequestPayload,
  CreateRefundPayload,
  RefundsQuery,
  UpdateRefundPayload,
} from "@/features/refunds/interfaces/refunds.interfaces";
import { toast } from "@/components/ui/toast";

export const refundsQueryKeys = {
  root: ["refunds"] as const,
  list: (storeId: string, query?: RefundsQuery) =>
    ["refunds", storeId, query] as const,
  detail: (id: string) => ["refund", id] as const,
};

export const useRefunds = (storeId: string, query?: RefundsQuery) => {
  return useQuery({
    queryKey: refundsQueryKeys.list(storeId, query),
    queryFn: () => listRefunds(storeId, query),
    enabled: !!storeId,
  });
};

export const useRefund = (id: string) => {
  return useQuery({
    queryKey: refundsQueryKeys.detail(id),
    queryFn: () => getRefund(id),
    enabled: !!id,
  });
};

export const useCreateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRefundPayload) => createRefund(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: refundsQueryKeys.root });
      toast.add({
        title: "Refund requested",
        description: "A manager can approve it from the Payments hub.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not request refund",
        description: error.message,
        type: "error",
      });
    },
  });
};

// No toast here, matching useCreatePublicTip/useCreatePublicReview — this is
// a full-screen guest flow, so the component shows its own inline
// success/error UI instead of a corner toast.
export const useCreatePublicRefundRequest = () => {
  return useMutation({
    mutationFn: ({
      tipId,
      payload,
    }: {
      tipId: string;
      payload: CreatePublicRefundRequestPayload;
    }) => createPublicRefundRequest(tipId, payload),
  });
};

export const useUpdateRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRefundPayload }) =>
      updateRefund(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: refundsQueryKeys.root });
      toast.add({ title: "Refund updated", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update refund",
        description: error.message,
        type: "error",
      });
    },
  });
};
