import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeDashboard,
  getEmployeeQrCode,
  listEmployees,
  resendEmployeeInvite,
  updateEmployee,
} from "@/features/employees/services/employees.services";
import type {
  CreateEmployeePayload,
  EmployeesQuery,
  UpdateEmployeePayload,
} from "@/features/employees/interfaces/employees.interfaces";
import { toast } from "@/components/ui/toast";
import { useMyAccounts, usersQueryKeys } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth.store";
import { useEmployeeWorkspaceStore } from "@/stores/employee-workspace.store";
import { getErrorMessage } from "@/lib/api-error";

export const employeesQueryKeys = {
  root: ["employees"] as const,
  list: (storeId: string, query?: EmployeesQuery) =>
    ["employees", storeId, query] as const,
  detail: (id: string) => ["employee", id] as const,
  dashboard: (id: string) => ["employee-dashboard", id] as const,
  qrCode: (id: string) => ["employee-qr-code", id] as const,
};

export const useEmployees = (storeId: string, query?: EmployeesQuery) => {
  return useQuery({
    queryKey: employeesQueryKeys.list(storeId, query),
    queryFn: () => listEmployees(storeId, query),
    enabled: !!storeId,
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeesQueryKeys.detail(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });
};

export const useEmployeeDashboard = (id: string) => {
  return useQuery({
    queryKey: employeesQueryKeys.dashboard(id),
    queryFn: () => getEmployeeDashboard(id),
    enabled: !!id,
  });
};

export const useEmployeeQrCode = (id: string) => {
  return useQuery({
    queryKey: employeesQueryKeys.qrCode(id),
    queryFn: () => getEmployeeQrCode(id),
    enabled: !!id,
  });
};

/**
 * The logged-in user's own Employee identity for the employee portal.
 * A User can hold multiple Employee accounts (multi-Store employment);
 * an account switcher lets the user pick among multiple, persisted in
 * `useEmployeeWorkspaceStore`; falls back to the first one.
 */
export const useCurrentEmployee = () => {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const accountsQuery = useMyAccounts(hydrated && !!accessToken);
  const employeeAccountId = useEmployeeWorkspaceStore(
    (state) => state.employeeAccountId,
  );

  const employeeAccounts = accountsQuery.data?.employee_accounts ?? [];
  const employee =
    employeeAccounts.find((account) => account.id === employeeAccountId) ??
    employeeAccounts[0] ??
    null;

  return {
    employee,
    store: employee?.store ?? null,
    employeeId: employee?.id ?? null,
    storeId: employee?.store_id ?? null,
    isPending: !hydrated || (!!accessToken && accountsQuery.isPending),
    isError: accountsQuery.isError,
    error: accountsQuery.error,
    isReady: !!employee,
  };
};

export const useCreateEmployee = (storeId: string) => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.employees.toast");

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      createEmployee(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.employeeCreated, { store_id: storeId });
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      toast.add({
        title: t("createdTitle"),
        description: t("createdDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("createFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.employees.toast");

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(id, payload),
    onSuccess: (data, variables) => {
      trackEvent(AnalyticsEvents.employeeUpdated);
      queryClient.setQueryData(employeesQueryKeys.detail(variables.id), data);
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: employeesQueryKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.accounts,
      });
      const deactivated = variables.payload.is_active === false;
      const activated = variables.payload.is_active === true;
      toast.add({
        title: deactivated
          ? t("deactivatedTitle")
          : activated
            ? t("activatedTitle")
            : t("updatedTitle"),
        description: deactivated
          ? t("deactivatedDescription")
          : activated
            ? t("activatedDescription")
            : t("updatedDescription"),
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

export const useResendEmployeeInvite = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.employees.toast");

  return useMutation({
    mutationFn: (id: string) => resendEmployeeInvite(id),
    onSuccess: (data) => {
      trackEvent(AnalyticsEvents.employeeInviteResent);
      queryClient.setQueryData(employeesQueryKeys.detail(data.id), data);
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      toast.add({
        title: t("inviteSentTitle"),
        description: t("inviteSentDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("inviteFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.team.employees.toast");

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.employeeDeleted);
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      toast.add({
        title: t("deletedTitle"),
        description: t("deletedDescription"),
        type: "success",
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
