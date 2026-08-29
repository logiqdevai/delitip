import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyPayoutAccount,
  createStorePayoutAccount,
  getMyPayoutAccount,
  getStorePayoutAccount,
} from "@/features/payout-accounts/services/payout-accounts.services";
import type { CreatePayoutAccountPayload } from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import { toast } from "@/components/ui/toast";

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
