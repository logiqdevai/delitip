"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { EmployeeCard } from "@/app/dashboard/employees/components/employee-card";
import { EmployeeCardsSkeleton } from "@/app/dashboard/employees/components/employee-cards-skeleton";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import {
  useEmployees,
  useUpdateEmployee,
} from "@/features/employees/hooks/use-employees";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { Routes } from "@/routes/routes";

export const EmployeesPageContent: FC = () => {
  const router = useRouter();
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const employeesQuery = useEmployees(storeId ?? "", { limit: 100 });
  const updateEmployee = useUpdateEmployee();
  const deactivateConfirm = useConfirmationDialog();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null,
  );
  const [pendingToggle, setPendingToggle] = useState<Employee | null>(null);

  const employees = employeesQuery.data?.data ?? [];
  const editingEmployee =
    employees.find((employee) => employee.id === editingEmployeeId) ?? null;

  const openCreate = () => {
    setEditingEmployeeId(null);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployeeId(employee.id);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingEmployeeId(null);
    }
  };

  const requestToggleActive = (employee: Employee) => {
    if (employee.is_active) {
      setPendingToggle(employee);
      deactivateConfirm.openDialog();
      return;
    }
    void updateEmployee.mutateAsync({
      id: employee.id,
      payload: { is_active: true },
    });
  };

  const confirmDeactivate = async () => {
    if (!pendingToggle) return;
    await updateEmployee.mutateAsync({
      id: pendingToggle.id,
      payload: { is_active: false },
    });
    setPendingToggle(null);
  };

  if (workspacePending) {
    return (
      <div className="space-y-6">
        <DetailSkeleton fieldCount={2} />
        <EmployeeCardsSkeleton />
      </div>
    );
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before managing employees.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Employees"
        description={
          store
            ? `Manage team members for ${store.name}.`
            : "Manage team members, assigned QR codes, and performance metrics."
        }
        actions={
          <Button
            type="button"
            className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-chip font-semibold text-ink-charcoal shadow-sm hover:bg-brand-700"
            onClick={openCreate}
          >
            <Plus data-icon="inline-start" className="size-3.5" />
            Add New Employee
          </Button>
        }
      />

      {employeesQuery.isPending ? (
        <EmployeeCardsSkeleton />
      ) : employeesQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load employees</EmptyTitle>
            <EmptyDescription>
              {employeesQuery.error.message}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void employeesQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : employees.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No employees yet</EmptyTitle>
            <EmptyDescription>
              Add your first team member so customers can tip and leave
              feedback.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
              onClick={openCreate}
            >
              <Plus data-icon="inline-start" className="size-3.5" />
              Add New Employee
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={openEdit}
              onToggleActive={requestToggleActive}
            />
          ))}
        </ul>
      )}

      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        storeId={storeId}
        employee={editingEmployee}
        onCreated={(created) =>
          router.push(Routes.dashboard.employeeDetail(created.id))
        }
      />

      <ConfirmationDialog
        state={{
          ...deactivateConfirm,
          onOpenChange: (open) => {
            deactivateConfirm.onOpenChange(open);
            if (!open) {
              setPendingToggle(null);
            }
          },
        }}
        title="Deactivate employee?"
        description={
          pendingToggle
            ? `${pendingToggle.full_name} will be marked inactive and hidden from active staff lists.`
            : "This employee will be marked inactive."
        }
        confirmLabel="Deactivate"
        onConfirm={confirmDeactivate}
        isPending={updateEmployee.isPending}
      />
    </>
  );
};
