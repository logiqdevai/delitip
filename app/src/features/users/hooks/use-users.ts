import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  getMyAccounts,
  updateMe,
} from "@/features/users/services/users.services";
import { toast } from "@/components/ui/toast";

export const usersQueryKeys = {
  root: ["users"] as const,
  me: ["users", "me"] as const,
  accounts: ["users", "me", "accounts"] as const,
};

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: usersQueryKeys.me,
    queryFn: getMe,
    enabled,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.root });
      toast.add({
        title: "Account updated",
        description: "Your changes were saved.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useMyAccounts = (enabled = true) => {
  return useQuery({
    queryKey: usersQueryKeys.accounts,
    queryFn: getMyAccounts,
    enabled,
    staleTime: 30_000,
  });
};
