import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approvePayoutRequest,
  cancelPayoutRequest,
  createPayoutRequest,
  getAdminPayoutRequest,
  getAdminPayoutRequestInvoiceUrl,
  getAdminPendingPayoutRequestCount,
  getPayoutRequestPreview,
  getStorePayoutRequestInvoiceUrl,
  listAdminPayoutRequests,
  listStorePayoutRequests,
  recheckPayoutRequest,
  rejectPayoutRequest,
} from "@/features/payout-requests/services/payout-requests.services";
import type {
  AdminPayoutRequestsQuery,
  CreatePayoutRequestPayload,
  PayoutRequestsQuery,
  ReviewPayoutRequestPayload,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import {
  distributionsQueryKeys,
  payoutsQueryKeys,
} from "@/features/payouts/hooks/use-payouts";
import { toast } from "@/components/ui/toast";

export const payoutRequestsQueryKeys = {
  root: ["payout-requests"] as const,
  storeList: (storeId: string, query?: PayoutRequestsQuery) =>
    ["payout-requests", "store", storeId, query] as const,
  storePreview: (storeId: string) =>
    ["payout-requests", "preview", storeId] as const,
  adminList: (query?: AdminPayoutRequestsQuery) =>
    ["payout-requests", "admin", query] as const,
  adminPendingCount: ["payout-requests", "admin", "pending-count"] as const,
  adminDetail: (id: string) => ["payout-request", "admin", id] as const,
  adminInvoiceUrl: (id: string) =>
    ["payout-request", "admin", id, "invoice-url"] as const,
};

// Signed URLs live 30 minutes; refresh a bit before that.
const INVOICE_URL_STALE_MS = 25 * 60 * 1000;

const invalidateMoneyViews = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  void queryClient.invalidateQueries({ queryKey: payoutRequestsQueryKeys.root });
  void queryClient.invalidateQueries({ queryKey: ["payout-request"] });
  void queryClient.invalidateQueries({ queryKey: payoutsQueryKeys.root });
  void queryClient.invalidateQueries({ queryKey: distributionsQueryKeys.root });
};

export const usePayoutRequestPreview = (storeId: string, enabled = true) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.storePreview(storeId),
    queryFn: () => getPayoutRequestPreview(storeId),
    enabled: !!storeId && enabled,
  });
};

export const useStorePayoutRequests = (
  storeId: string,
  query?: PayoutRequestsQuery,
) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.storeList(storeId, query),
    queryFn: () => listStorePayoutRequests(storeId, query),
    enabled: !!storeId,
  });
};

export const useCreatePayoutRequest = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutRequestPayload) =>
      createPayoutRequest(storeId, payload),
    onSuccess: () => {
      invalidateMoneyViews(queryClient);
      toast.add({
        title: "Payout request submitted",
        description:
          "We'll check the invoice and let you know once it's reviewed.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not submit the payout request",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useCancelPayoutRequest = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelPayoutRequest(storeId, id),
    onSuccess: () => {
      invalidateMoneyViews(queryClient);
      toast.add({
        title: "Payout request cancelled",
        description: "Your tips are available to request again.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not cancel the payout request",
        description: error.message,
        type: "error",
      });
    },
  });
};

// Opens the invoice in a new tab. A mutation (not a query) because the
// signed URL is fetched on demand, when the person actually clicks.
export const useOpenStorePayoutRequestInvoice = (storeId: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { url } = await getStorePayoutRequestInvoiceUrl(storeId, id);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not open the invoice",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useAdminPayoutRequests = (query?: AdminPayoutRequestsQuery) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.adminList(query),
    queryFn: () => listAdminPayoutRequests(query),
  });
};

export const useAdminPendingPayoutRequestCount = (enabled = true) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.adminPendingCount,
    queryFn: getAdminPendingPayoutRequestCount,
    enabled,
  });
};

export const useAdminPayoutRequest = (id: string) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.adminDetail(id),
    queryFn: () => getAdminPayoutRequest(id),
    enabled: !!id,
  });
};

export const useAdminPayoutRequestInvoiceUrl = (id: string) => {
  return useQuery({
    queryKey: payoutRequestsQueryKeys.adminInvoiceUrl(id),
    queryFn: () => getAdminPayoutRequestInvoiceUrl(id),
    enabled: !!id,
    staleTime: INVOICE_URL_STALE_MS,
  });
};

export const useApprovePayoutRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayoutRequestPayload) =>
      approvePayoutRequest(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      invalidateMoneyViews(queryClient);
      if (data.failure_reason && data.status === "PENDING_REVIEW") {
        toast.add({
          title: "Bank transfer failed",
          description: data.failure_reason,
          type: "error",
        });
        return;
      }
      toast.add({
        title: "Payout approved",
        description: "The bank transfer has started and the store was notified.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not approve the payout request",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRejectPayoutRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { admin_note: string }) =>
      rejectPayoutRequest(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      invalidateMoneyViews(queryClient);
      toast.add({
        title: "Payout request rejected",
        description: "The store was notified and can submit a corrected invoice.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not reject the payout request",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRecheckPayoutRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recheckPayoutRequest(id),
    onSuccess: (data) => {
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      void queryClient.invalidateQueries({ queryKey: payoutRequestsQueryKeys.root });
      toast.add({
        title: "Invoice re-checked",
        description:
          data.check_status === "FAILED"
            ? "The automatic check failed again — review the invoice manually."
            : "The automatic check finished.",
        type: data.check_status === "FAILED" ? "error" : "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not re-run the check",
        description: error.message,
        type: "error",
      });
    },
  });
};
