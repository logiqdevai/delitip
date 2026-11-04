import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createEmployeePayoutAccount,
  createMyPayoutAccount,
  createStorePayoutAccount,
  getEmployeePayoutAccount,
  getMyPayoutAccount,
  getStorePayoutAccount,
  reconcilePayoutAccounts,
  refreshEmployeePayoutAccountStatus,
  refreshMyPayoutAccountStatus,
  refreshStorePayoutAccountStatus,
} from "@/features/payout-accounts/services/payout-accounts.services";
import type {
  CreatePayoutAccountPayload,
  PayoutAccount,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

const describeRefreshResult = (
  account: PayoutAccount,
  t: (key: string) => string,
) =>
  account.status === "ACTIVE"
    ? {
        title: t("active.title"),
        description: t("active.description"),
        type: "success" as const,
      }
    : {
        title: t("pending.title"),
        description: t("pending.description"),
        type: "success" as const,
      };

export const payoutAccountsQueryKeys = {
  mine: ["payout-account", "me"] as const,
  store: (storeId: string) => ["payout-account", "store", storeId] as const,
  employee: (employeeId: string) =>
    ["payout-account", "employee", employeeId] as const,
};

export const useReconcilePayoutAccounts = () => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reconcilePayoutAccounts,
    onSuccess: ({ checked, promoted }) => {
      trackEvent(AnalyticsEvents.adminPayoutAccountsReconciled, { checked, promoted });
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "payout-account",
      });
      toast.add({
        title: t("reconciled.title"),
        description:
          promoted > 0
            ? t("reconciled.promoted", { promoted, checked })
            : t("reconciled.none", { checked }),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("reconciled.failed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useMyPayoutAccount = (enabled = true) => {
  return useQuery({
    queryKey: payoutAccountsQueryKeys.mine,
    queryFn: getMyPayoutAccount,
    enabled,
  });
};

export const useCreateMyPayoutAccount = () => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createMyPayoutAccount(payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.payoutAccountCreated, { scope: "me" });
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.mine,
      });
      toast.add({
        title: t("myConnected.title"),
        description: t("myConnected.description"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("connectFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRefreshMyPayoutAccountStatus = () => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshMyPayoutAccountStatus,
    onSuccess: (account) => {
      trackEvent(AnalyticsEvents.payoutAccountStatusRefreshed, { scope: "me" });
      queryClient.setQueryData(payoutAccountsQueryKeys.mine, account);
      toast.add(describeRefreshResult(account, t));
    },
    onError: (error: Error) => {
      toast.add({
        title: t("refreshFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useStorePayoutAccount = (storeId: string) => {
  return useQuery({
    queryKey: payoutAccountsQueryKeys.store(storeId),
    queryFn: () => getStorePayoutAccount(storeId),
    enabled: !!storeId,
  });
};

export const useCreateStorePayoutAccount = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createStorePayoutAccount(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.payoutAccountCreated, { scope: "store", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.store(storeId),
      });
      toast.add({
        title: t("storeConnected.title"),
        description: t("storeConnected.description"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("connectFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRefreshStorePayoutAccountStatus = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshStorePayoutAccountStatus(storeId),
    onSuccess: (account) => {
      trackEvent(AnalyticsEvents.payoutAccountStatusRefreshed, { scope: "store", store_id: storeId });
      queryClient.setQueryData(payoutAccountsQueryKeys.store(storeId), account);
      toast.add(describeRefreshResult(account, t));
    },
    onError: (error: Error) => {
      toast.add({
        title: t("refreshFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useEmployeePayoutAccount = (employeeId: string, enabled = true) => {
  return useQuery({
    queryKey: payoutAccountsQueryKeys.employee(employeeId),
    queryFn: () => getEmployeePayoutAccount(employeeId),
    enabled: !!employeeId && enabled,
  });
};

export const useCreateEmployeePayoutAccount = (employeeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createEmployeePayoutAccount(employeeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.payoutAccountCreated, { scope: "employee" });
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.employee(employeeId),
      });
      toast.add({
        title: t("employeeLinked.title"),
        description: t("employeeLinked.description"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("linkFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRefreshEmployeePayoutAccountStatus = (employeeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.payoutAccounts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshEmployeePayoutAccountStatus(employeeId),
    onSuccess: (account) => {
      trackEvent(AnalyticsEvents.payoutAccountStatusRefreshed, { scope: "employee" });
      queryClient.setQueryData(payoutAccountsQueryKeys.employee(employeeId), account);
      toast.add(describeRefreshResult(account, t));
    },
    onError: (error: Error) => {
      toast.add({
        title: t("refreshFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
