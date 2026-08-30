"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, QrCode, UserCheck, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import {
  useEmployee,
  useEmployeeDashboard,
  useUpdateEmployee,
} from "@/features/employees/hooks/use-employees";
import { getEmployeeStatusLabel } from "@/config/constants/dropdowns/employees/employee-status-form.options";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import {
  getQrCodeEmployeeCount,
  getQrCodeEmployeeIds,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getAbsoluteTipUrl } from "@/features/qr-codes/utils/qr-tip-url.utils";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { formatMoney } from "@/lib/money";
import { Routes } from "@/routes/routes";

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export const EmployeeDetailPageContent: FC<{ employeeId: string }> = ({
  employeeId,
}) => {
  const { store, storeId } = useWorkspace();
  const employeeQuery = useEmployee(employeeId);
  const dashboardQuery = useEmployeeDashboard(employeeId);
  const qrCodesQuery = useQrCodes(storeId ?? "", { limit: 100 });
  const updateEmployee = useUpdateEmployee();
  const deactivateConfirm = useConfirmationDialog();
  const [formOpen, setFormOpen] = useState(false);

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

  const personalQr = (qrCodesQuery.data?.data ?? []).find(
    (qr) =>
      getQrCodeEmployeeCount(qr) === 1 &&
      getQrCodeEmployeeIds(qr).includes(employee.id),
  );

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
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-charcoal text-lg font-bold text-paper-offwhite">
            {employee.photo_document?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={employee.photo_document.url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials(employee.full_name)
            )}
          </div>
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

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFormOpen(true)}
          >
            <Pencil data-icon="inline-start" className="size-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant={employee.is_active ? "destructive" : "secondary"}
            size="sm"
            onClick={() => {
              if (employee.is_active) {
                deactivateConfirm.openDialog();
              } else {
                void updateEmployee.mutateAsync({
                  id: employee.id,
                  payload: { is_active: true },
                });
              }
            }}
          >
            {employee.is_active ? (
              <UserRoundX data-icon="inline-start" className="size-3.5" />
            ) : (
              <UserCheck data-icon="inline-start" className="size-3.5" />
            )}
            {employee.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
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
          <QrCode className="size-4" strokeWidth={2} />
          Personal QR
        </h2>
        {qrCodesQuery.isPending ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
        ) : personalQr && store ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-ink-charcoal">
                {personalQr.label}
              </div>
              <div className="text-xs break-all text-zinc-500">
                {getAbsoluteTipUrl(store.slug, personalQr.code)}
              </div>
            </div>
            <Link
              href={Routes.dashboard.access}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Manage in QR & Access →
            </Link>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500">
            No QR code is scoped to just this employee yet.{" "}
            <Link
              href={Routes.dashboard.access}
              className="font-semibold text-brand-700 hover:underline"
            >
              Create one
            </Link>
            .
          </p>
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
    </div>
  );
};
