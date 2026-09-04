"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import {
  Mail,
  MoreHorizontal,
  Pencil,
  QrCode,
  UserRoundX,
  UserCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { EmployeeQrCodesDialog } from "@/app/dashboard/employees/components/employee-qr-codes-dialog";
import { getEmployeeStatusLabel } from "@/config/constants/dropdowns/employees/employee-status-form.options";
import { getEmployeeAccountStatusLabel } from "@/config/constants/dropdowns/employees/employee-account-status-form.options";
import { useResendEmployeeInvite } from "@/features/employees/hooks/use-employees";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onToggleActive: (employee: Employee) => void;
}

export const EmployeeCard: FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onToggleActive,
}) => {
  const position = employee.position?.trim() || "Team member";
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const isSignedUp = !!employee.user?.registered_at;
  const resendInvite = useResendEmployeeInvite();

  return (
    <li
      className={cn(
        "flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        !employee.is_active && "bg-zinc-50/80",
      )}
    >
      <Link
        href={Routes.dashboard.employeeDetail(employee.id)}
        className="group flex min-w-0 flex-1 items-center gap-3"
      >
        <EmployeeAvatar
          name={employee.full_name}
          photoUrl={employee.photo_document?.url}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-sm font-bold text-ink-charcoal group-hover:underline">
              {employee.full_name}
            </h3>
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-caption font-bold",
                employee.is_active
                  ? "bg-brand-50 text-brand-700"
                  : "bg-neutral-fill font-medium text-zinc-500",
              )}
            >
              {getEmployeeStatusLabel(employee.is_active)}
            </span>
            {!isSignedUp ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-amber-50 px-2 py-0.5 text-caption font-bold text-amber-700">
                {getEmployeeAccountStatusLabel(employee.user?.registered_at)}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {position}
            <span className="text-zinc-300"> · </span>
            {employee.email}
          </p>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "size-8 shrink-0 self-end px-0 text-zinc-500 hover:text-ink-charcoal sm:self-auto",
          )}
          aria-label={`Actions for ${employee.full_name}`}
        >
          <MoreHorizontal className="size-4" strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => onEdit(employee)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setQrDialogOpen(true)}>
            <QrCode />
            QR codes
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
          <DropdownMenuItem onClick={() => onToggleActive(employee)}>
            {employee.is_active ? <UserRoundX /> : <UserCheck />}
            {employee.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmployeeQrCodesDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        employee={employee}
      />
    </li>
  );
};
