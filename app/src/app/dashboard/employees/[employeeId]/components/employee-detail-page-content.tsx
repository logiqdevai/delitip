"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Mail,
  Pencil,
  Plus,
  QrCode as QrCodeIcon,
  Receipt,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { QrCodeFormDialog } from "@/app/dashboard/access/components/qr-code-form-dialog";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import { EmployeePayoutAccountCard } from "@/app/dashboard/employees/[employeeId]/components/employee-payout-account-card";
import { QrRow } from "@/app/dashboard/employees/components/employee-qr-codes-dialog";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import {
  useDeleteEmployee,
  useEmployee,
  useEmployeeDashboard,
  useResendEmployeeInvite,
  useUpdateEmployee,
} from "@/features/employees/hooks/use-employees";
import { getEmployeeStatusLabel } from "@/config/constants/dropdowns/employees/employee-status-form.options";
import { getEmployeeAccountStatusLabel } from "@/config/constants/dropdowns/employees/employee-account-status-form.options";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useEmployeeTips } from "@/features/tips/hooks/use-tips";
import type { PayoutStatus } from "@/features/tips/interfaces/tips.interfaces";
import { useMe } from "@/features/users/hooks/use-users";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

const payoutStatusChipClass: Record<PayoutStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  PAID: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

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
  const tipsQuery = useEmployeeTips(employeeId, { limit: 100 });
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const resendInvite = useResendEmployeeInvite();
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
  const isSignedUp = !!employee.user?.registered_at;
  const dashboard = dashboardQuery.data;
  const currency = store?.currency ?? "EUR";

  const employeeQrCodes = qrCodesQuery.data?.data ?? [];
  const employeeTips = tipsQuery.data?.data ?? [];

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

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="inline-flex shrink-0 rounded-full ring-2 ring-electric-lime/30 ring-offset-2 ring-offset-white">
                <EmployeeAvatar
                  name={employee.full_name}
                  photoUrl={employee.photo_document?.url}
                  className="size-14 text-lg"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-extrabold tracking-tight text-ink-charcoal sm:text-xl">
                  {employee.full_name}
                </h1>
                <p className="truncate text-sm font-medium text-zinc-500">
                  {employee.position?.trim() || "Team member"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500">
                <Mail
                  className="size-3.5 shrink-0 text-zinc-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="min-w-0 truncate">{employee.email}</span>
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={
                    employee.is_active
                      ? "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-caption font-bold text-brand-700"
                      : "inline-flex items-center rounded-full bg-neutral-fill px-2.5 py-1 text-caption font-medium text-zinc-500"
                  }
                >
                  {getEmployeeStatusLabel(employee.is_active)}
                </span>
                {!isSignedUp ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-caption font-bold text-amber-700">
                    {getEmployeeAccountStatusLabel(employee.user?.registered_at)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4 sm:shrink-0 sm:border-0 sm:pt-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "w-full justify-between gap-2 px-4 font-semibold sm:w-auto sm:justify-center sm:px-3 sm:text-xs sm:font-medium",
                )}
                aria-label="Employee actions"
              >
                Actions
                <ChevronDown className="size-4 opacity-50 sm:size-3.5" strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[min(100vw-2.5rem,16rem)] sm:min-w-44"
              >
                <DropdownMenuItem onClick={() => setFormOpen(true)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                {!isSignedUp ? (
                  <DropdownMenuItem
                    onClick={() => resendInvite.mutate(employee.id)}
                    disabled={resendInvite.isPending}
                  >
                    <Mail />
                    Resend invite
                  </DropdownMenuItem>
                ) : null}
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
        </div>
      </section>

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

      <EmployeePayoutAccountCard
        employeeId={employee.id}
        hasLinkedUser={!!employee.user_id}
      />

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
                <Button type="button" variant="outline" size="default" onClick={openCreateQr}>
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
                size="default"
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

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-charcoal">
          <Receipt className="size-4" strokeWidth={2} />
          Tips
        </h2>
        {tipsQuery.isPending ? (
          <TableSkeleton columns={3} rows={4} />
        ) : tipsQuery.isError ? (
          <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
            <EmptyHeader>
              <EmptyTitle>Could not load tips</EmptyTitle>
              <EmptyDescription>{tipsQuery.error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : employeeTips.length === 0 ? (
          <Empty className="border border-dashed border-zinc-200 bg-zinc-50 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>No tips yet</EmptyTitle>
              <EmptyDescription>
                Tips this employee receives will show up here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead className="px-4">Amount</TableHead>
                  <TableHead className="px-4 text-right">Payout status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeTips.map((distribution) => (
                  <TableRow
                    key={distribution.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(Routes.dashboard.tipDetail(distribution.tip_id))
                    }
                  >
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(distribution.tip.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                      {formatMoney(distribution.amount, distribution.tip.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          payoutStatusChipClass[distribution.payout_status],
                        )}
                      >
                        {getPayoutStatusLabel(distribution.payout_status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
