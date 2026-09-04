import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const describeRefreshResult = (account: PayoutAccount) =>
  account.status === "ACTIVE"
    ? { title: "Payout account active", description: "It's ready to receive payouts.", type: "success" as const }
    : {
        title: "Still pending",
        description: "Viva hasn't confirmed this account yet — check back shortly.",
        type: "success" as const,
      };

export const payoutAccountsQueryKeys = {
  mine: ["payout-account", "me"] as const,
  store: (storeId: string) => ["payout-account", "store", storeId] as const,
  employee: (employeeId: string) =>
    ["payout-account", "employee", employeeId] as const,
};

export const useReconcilePayoutAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reconcilePayoutAccounts,
    onSuccess: ({ checked, promoted }) => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "payout-account",
      });
      toast.add({
        title: "IBANs reconciled",
        description:
          promoted > 0
            ? `${promoted} of ${checked} pending account${checked === 1 ? "" : "s"} promoted to active.`
            : `Checked ${checked} pending account${checked === 1 ? "" : "s"} — none newly verified.`,
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not reconcile IBANs",
        description: error.message,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createMyPayoutAccount(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.mine,
      });
      toast.add({
        title: "Payout account connected",
        description: "You're ready to receive cash-outs.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not connect payout account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRefreshMyPayoutAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshMyPayoutAccountStatus,
    onSuccess: (account) => {
      queryClient.setQueryData(payoutAccountsQueryKeys.mine, account);
      toast.add(describeRefreshResult(account));
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not check payout account status",
        description: error.message,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createStorePayoutAccount(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.store(storeId),
      });
      toast.add({
        title: "Payout account connected",
        description: "Your store is ready to receive payouts.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not connect payout account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRefreshStorePayoutAccountStatus = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshStorePayoutAccountStatus(storeId),
    onSuccess: (account) => {
      queryClient.setQueryData(payoutAccountsQueryKeys.store(storeId), account);
      toast.add(describeRefreshResult(account));
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not check payout account status",
        description: error.message,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePayoutAccountPayload) =>
      createEmployeePayoutAccount(employeeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: payoutAccountsQueryKeys.employee(employeeId),
      });
      toast.add({
        title: "Payout account linked",
        description: "This employee is ready to receive payouts.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not link payout account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRefreshEmployeePayoutAccountStatus = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshEmployeePayoutAccountStatus(employeeId),
    onSuccess: (account) => {
      queryClient.setQueryData(payoutAccountsQueryKeys.employee(employeeId), account);
      toast.add(describeRefreshResult(account));
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not check payout account status",
        description: error.message,
        type: "error",
      });
    },
  });
};
