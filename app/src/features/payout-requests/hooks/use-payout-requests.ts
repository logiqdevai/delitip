import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
import { getErrorMessage } from "@/lib/api-error";

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
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutRequestPayload) =>
      createPayoutRequest(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.payoutRequestCreated, { store_id: storeId });
      invalidateMoneyViews(queryClient);
      toast.add({
        title: t("payoutRequests.submittedTitle"),
        description: t("payoutRequests.submittedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.submitFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useCancelPayoutRequest = (storeId: string) => {
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelPayoutRequest(storeId, id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.payoutRequestCancelled, { store_id: storeId });
      invalidateMoneyViews(queryClient);
      toast.add({
        title: t("payoutRequests.cancelledTitle"),
        description: t("payoutRequests.cancelledDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.cancelFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

// Opens the invoice in a new tab. A mutation (not a query) because the
// signed URL is fetched on demand, when the person actually clicks.
export const useOpenStorePayoutRequestInvoice = (storeId: string) => {
  const t = useTranslations("dashboard.money.toasts");
  return useMutation({
    mutationFn: async (id: string) => {
      const { url } = await getStorePayoutRequestInvoiceUrl(storeId, id);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.openInvoiceFailed"),
        description: getErrorMessage(error),
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
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayoutRequestPayload) =>
      approvePayoutRequest(id, payload),
    onSuccess: (data) => {
      trackEvent(AnalyticsEvents.adminPayoutRequestApproved, { request_id: id });
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      invalidateMoneyViews(queryClient);
      if (data.failure_reason && data.status === "PENDING_REVIEW") {
        toast.add({
          title: t("payoutRequests.transferFailed"),
          description: data.failure_reason,
          type: "error",
        });
        return;
      }
      toast.add({
        title: t("payoutRequests.approvedTitle"),
        description: t("payoutRequests.approvedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.approveFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRejectPayoutRequest = (id: string) => {
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { admin_note: string }) =>
      rejectPayoutRequest(id, payload),
    onSuccess: (data) => {
      trackEvent(AnalyticsEvents.adminPayoutRequestRejected, { request_id: id });
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      invalidateMoneyViews(queryClient);
      toast.add({
        title: t("payoutRequests.rejectedTitle"),
        description: t("payoutRequests.rejectedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.rejectFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRecheckPayoutRequest = (id: string) => {
  const t = useTranslations("dashboard.money.toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recheckPayoutRequest(id),
    onSuccess: (data) => {
      trackEvent(AnalyticsEvents.adminPayoutRequestRechecked, { request_id: id });
      queryClient.setQueryData(payoutRequestsQueryKeys.adminDetail(id), data);
      void queryClient.invalidateQueries({ queryKey: payoutRequestsQueryKeys.root });
      toast.add({
        title: t("payoutRequests.recheckedTitle"),
        description:
          data.check_status === "FAILED"
            ? t("payoutRequests.recheckFailedAgain")
            : t("payoutRequests.recheckDone"),
        type: data.check_status === "FAILED" ? "error" : "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("payoutRequests.recheckFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
