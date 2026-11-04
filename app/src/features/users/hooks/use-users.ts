import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  deleteUser,
  getMe,
  getMyAccounts,
  listUsers,
  updateMe,
} from "@/features/users/services/users.services";
import type { UsersQuery } from "@/features/users/interfaces/users.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

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
  const t = useTranslations("dashboard.shell.toasts.users");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      trackEvent(AnalyticsEvents.profileUpdated);
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.root });
      toast.add({
        title: t("updatedTitle"),
        description: t("updatedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("updateFailed"),
        description: getErrorMessage(error),
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
  const t = useTranslations("dashboard.shell.toasts.users");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (result) => {
      trackEvent(AnalyticsEvents.accountDeleted);
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.root });

      const leftovers: string[] = [];
      if (result.files_failed > 0) {
        leftovers.push(t("leftoverFiles", { count: result.files_failed }));
      }
      if (result.viva_bank_accounts_failed > 0) {
        leftovers.push(
          t("leftoverVivaBankAccounts", {
            count: result.viva_bank_accounts_failed,
          }),
        );
      }
      if (result.viva_connected_accounts_remaining > 0) {
        leftovers.push(
          t("leftoverVivaConnectedAccounts", {
            count: result.viva_connected_accounts_remaining,
          }),
        );
      }

      toast.add({
        title: t("deletedTitle"),
        description:
          leftovers.length > 0
            ? t("deletedWithLeftovers", { details: leftovers.join("; ") })
            : t("deletedDescriptionDefault"),
        type: leftovers.length > 0 ? "warning" : "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("deleteFailed"),
        description: getErrorMessage(error),
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
