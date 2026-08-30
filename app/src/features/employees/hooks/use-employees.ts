import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeeDashboard,
  listEmployees,
  updateEmployee,
  updateEmployeeTranslation,
} from "@/features/employees/services/employees.services";
import type {
  CreateEmployeePayload,
  EmployeesQuery,
  UpdateEmployeePayload,
  UpdateEmployeeTranslationPayload,
} from "@/features/employees/interfaces/employees.interfaces";
import { toast } from "@/components/ui/toast";
import { useMyAccounts, usersQueryKeys } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth.store";
import { useEmployeeWorkspaceStore } from "@/stores/employee-workspace.store";

export const employeesQueryKeys = {
  root: ["employees"] as const,
  list: (storeId: string, query?: EmployeesQuery) =>
    ["employees", storeId, query] as const,
  detail: (id: string) => ["employee", id] as const,
  dashboard: (id: string) => ["employee-dashboard", id] as const,
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

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      createEmployee(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      toast.add({
        title: "Employee added",
        description: "They can now be assigned to QR codes and tips.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not add employee",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(id, payload),
    onSuccess: (_data, variables) => {
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
          ? "Employee deactivated"
          : activated
            ? "Employee activated"
            : "Employee updated",
        description: deactivated
          ? "They will no longer appear as active staff."
          : activated
            ? "They are active again for tipping and QR assignment."
            : "Your changes were saved.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update employee",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateEmployeeTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEmployeeTranslationPayload;
    }) => updateEmployeeTranslation(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: employeesQueryKeys.detail(variables.id),
      });
      toast.add({
        title: "Translation saved",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not save translation",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeesQueryKeys.root });
      toast.add({
        title: "Employee removed",
        description: "The employee record was deleted.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not remove employee",
        description: error.message,
        type: "error",
      });
    },
  });
};
