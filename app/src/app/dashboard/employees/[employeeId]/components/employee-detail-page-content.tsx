"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Pencil,
  Plus,
  QrCode as QrCodeIcon,
  Trash2,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCodeFormDialog } from "@/app/dashboard/access/components/qr-code-form-dialog";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import { QrRow } from "@/app/dashboard/employees/components/employee-qr-codes-dialog";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import {
  useDeleteEmployee,
  useEmployee,
  useEmployeeDashboard,
  useUpdateEmployee,
} from "@/features/employees/hooks/use-employees";
import { getEmployeeStatusLabel } from "@/config/constants/dropdowns/employees/employee-status-form.options";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useMe } from "@/features/users/hooks/use-users";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

export const EmployeeDetailPageContent: FC<{ employeeId: string }> = ({
  employeeId,
}) => {
  const router = useRouter();
  const { store, storeId } = useWorkspace();
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe();
  const employeeQuery = useEmployee(employeeId);
  const dashboardQuery = useEmployeeDashboard(employeeId);
  const qrCodesQuery = useQrCodes(storeId ?? "", {
    employee_ids: [employeeId],
    limit: 100,
  });
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const deactivateConfirm = useConfirmationDialog();
  const deleteConfirm = useConfirmationDialog();
  const [formOpen, setFormOpen] = useState(false);
  const [qrFormOpen, setQrFormOpen] = useState(false);
  const [editingQr, setEditingQr] = useState<QrCode | null>(null);

  const platformRole = meQuery.data?.role ?? authUser?.role;
  const canDeleteEmployee =
    platformRole === PlatformAuthRoles.ADMIN ||
    platformRole === PlatformAuthRoles.SUPER_ADMIN;

  if (employeeQuery.isPending) {
    return <DetailSkeleton fieldCount={6} />;
  }

  if (employeeQuery.isError || !employeeQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load this employee</EmptyTitle>
          <EmptyDescription>
            {employeeQuery.error?.message ?? "The employee may not exist."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.employees}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Back to Employees
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const employee = employeeQuery.data;
  const dashboard = dashboardQuery.data;
  const currency = store?.currency ?? "EUR";

  const employeeQrCodes = qrCodesQuery.data?.data ?? [];

  const openCreateQr = () => {
    setEditingQr(null);
    setQrFormOpen(true);
  };

  const openEditQr = (qr: QrCode) => {
    setEditingQr(qr);
    setQrFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.employees}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Back to Employees
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <EmployeeAvatar
            name={employee.full_name}
            photoUrl={employee.photo_document?.url}
            className="size-14 text-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-ink-charcoal">
              {employee.full_name}
            </h1>
            <p className="text-xs text-zinc-500">
              {employee.position?.trim() || "Team member"} · {employee.email}
            </p>
            <span
              className={
                employee.is_active
                  ? "mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700"
                  : "mt-1.5 inline-block rounded-full bg-neutral-fill px-2 py-0.5 text-caption font-medium text-zinc-500"
              }
            >
              {getEmployeeStatusLabel(employee.is_active)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5",
            )}
            aria-label="Employee actions"
          >
            Actions
            <ChevronDown className="size-3.5 opacity-60" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem onClick={() => setFormOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (employee.is_active) {
                  deactivateConfirm.openDialog();
                  return;
                }
                void updateEmployee.mutateAsync({
                  id: employee.id,
                  payload: { is_active: true },
                });
              }}
            >
              {employee.is_active ? <UserRoundX /> : <UserCheck />}
              {employee.is_active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            {canDeleteEmployee ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => deleteConfirm.openDialog()}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">
            Tips this month
          </span>
          <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
            {dashboardQuery.isPending ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              formatMoney(dashboard?.tips_this_month.total_amount ?? 0, currency)
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">
            Average rating
          </span>
          <div className="mt-1 text-xl font-extrabold text-rating-amber">
            {dashboardQuery.isPending ? (
              <Skeleton className="h-6 w-16" />
            ) : dashboard?.average_rating ? (
              `★ ${dashboard.average_rating.toFixed(2)}`
            ) : (
              "—"
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-500">
            Reviews
          </span>
          <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
            {dashboardQuery.isPending ? (
              <Skeleton className="h-6 w-10" />
            ) : (
              (dashboard?.reviews_count ?? 0)
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-charcoal">
          <QrCodeIcon className="size-4" strokeWidth={2} />
          QR codes
        </h2>
        {qrCodesQuery.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : qrCodesQuery.isError ? (
          <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
            <EmptyHeader>
              <EmptyTitle>Could not load QR codes</EmptyTitle>
              <EmptyDescription>{qrCodesQuery.error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : employeeQrCodes.length === 0 ? (
          <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <QrCodeIcon />
              </EmptyMedia>
              <EmptyTitle>No QR codes yet</EmptyTitle>
              <EmptyDescription>
                This employee isn&apos;t assigned to any QR code.
              </EmptyDescription>
            </EmptyHeader>
            {storeId && store ? (
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={openCreateQr}>
                  <Plus data-icon="inline-start" className="size-3.5" />
                  Create QR code
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-3">
              {employeeQrCodes.map((qr) => (
                <QrRow
                  key={qr.id}
                  qr={qr}
                  storeSlug={store?.slug ?? ""}
                  onEdit={openEditQr}
                />
              ))}
            </ul>
            {storeId && store ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={openCreateQr}
              >
                <Plus data-icon="inline-start" className="size-3.5" />
                Create another QR code
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {storeId ? (
        <EmployeeFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          storeId={storeId}
          employee={employee}
        />
      ) : null}

      {storeId && store ? (
        <QrCodeFormDialog
          open={qrFormOpen}
          onOpenChange={setQrFormOpen}
          storeId={storeId}
          storeSlug={store.slug}
          qr={editingQr}
          defaultEmployeeIds={editingQr ? undefined : [employee.id]}
          presetEmployees={[
            {
              id: employee.id,
              full_name: employee.full_name,
              position: employee.position,
            },
          ]}
        />
      ) : null}

      <ConfirmationDialog
        state={deactivateConfirm}
        title="Deactivate employee?"
        description={`${employee.full_name} will be marked inactive and hidden from active staff lists.`}
        confirmLabel="Deactivate"
        onConfirm={async () => {
          await updateEmployee.mutateAsync({
            id: employee.id,
            payload: { is_active: false },
          });
        }}
        isPending={updateEmployee.isPending}
      />

      {canDeleteEmployee ? (
        <ConfirmationDialog
          state={deleteConfirm}
          title="Delete employee?"
          description={`${employee.full_name} will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteEmployee.mutateAsync(employee.id);
            router.push(Routes.dashboard.employees);
          }}
          isPending={deleteEmployee.isPending}
        />
      ) : null}
    </div>
  );
};
