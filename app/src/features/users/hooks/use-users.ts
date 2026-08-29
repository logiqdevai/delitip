import { useQuery } from "@tanstack/react-query";
import { getMe, getMyAccounts } from "@/features/users/services/users.services";

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

export const useMyAccounts = (enabled = true) => {
  return useQuery({
    queryKey: usersQueryKeys.accounts,
    queryFn: getMyAccounts,
    enabled,
    staleTime: 30_000,
  });
};
