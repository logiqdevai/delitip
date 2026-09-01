import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyPayoutAccount,
  createStorePayoutAccount,
  getMyPayoutAccount,
  getStorePayoutAccount,
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
