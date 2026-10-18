import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  getMe,
  getMyAccounts,
  listUsers,
  updateMe,
} from "@/features/users/services/users.services";
import type { UsersQuery } from "@/features/users/interfaces/users.interfaces";
import { toast } from "@/components/ui/toast";

export const usersQueryKeys = {
  root: ["users"] as const,
  me: ["users", "me"] as const,
  accounts: ["users", "me", "accounts"] as const,
  list: (query?: UsersQuery) => ["users", "list", query] as const,
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

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.root });

      const leftovers: string[] = [];
      if (result.files_failed > 0) {
        leftovers.push(
          `${result.files_failed} Google Cloud file${result.files_failed === 1 ? "" : "s"} could not be deleted`,
        );
      }
      if (result.viva_bank_accounts_failed > 0) {
        leftovers.push(
          `${result.viva_bank_accounts_failed} Viva bank account${result.viva_bank_accounts_failed === 1 ? "" : "s"} could not be archived`,
        );
      }
      if (result.viva_connected_accounts_remaining > 0) {
        leftovers.push(
          `${result.viva_connected_accounts_remaining} Viva connected account${result.viva_connected_accounts_remaining === 1 ? "" : "s"} must be closed manually in Viva`,
        );
      }

      toast.add({
        title: "User deleted",
        description:
          leftovers.length > 0
            ? `The user was removed, but ${leftovers.join("; ")}.`
            : "The user and all their related data were removed.",
        type: leftovers.length > 0 ? "warning" : "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not delete user",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUsers = (query?: UsersQuery, enabled = true) => {
  return useQuery({
    queryKey: usersQueryKeys.list(query),
    queryFn: () => listUsers(query),
    enabled,
  });
};
