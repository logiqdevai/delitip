"use client";

import { type FC } from "react";
import Link from "next/link";
import { Pencil, QrCode, UserRoundX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEmployeeStatusLabel } from "@/config/constants/dropdowns/employees/employee-status-form.options";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onToggleActive: (employee: Employee) => void;
}

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export const EmployeeCard: FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onToggleActive,
}) => {
  const position = employee.position?.trim() || "Team member";

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
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-charcoal text-xs font-bold text-paper-offwhite">
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
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {position}
            <span className="text-zinc-300"> · </span>
            {employee.email}
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
        <Button
          variant="ghost"
          size="sm"
          className="size-8 px-0 text-zinc-500 hover:text-ink-charcoal"
          nativeButton={false}
          render={<Link href={Routes.dashboard.access} />}
          aria-label={`View QR codes for ${employee.full_name}`}
        >
          <QrCode className="size-3.5" strokeWidth={2} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 px-0 text-zinc-500 hover:text-ink-charcoal"
          onClick={() => onEdit(employee)}
          aria-label={`Edit ${employee.full_name}`}
        >
          <Pencil className="size-3.5" strokeWidth={2} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "size-8 px-0",
            employee.is_active
              ? "text-zinc-500 hover:text-red-700"
              : "text-zinc-500 hover:text-brand-700",
          )}
          onClick={() => onToggleActive(employee)}
          aria-label={
            employee.is_active
              ? `Deactivate ${employee.full_name}`
              : `Activate ${employee.full_name}`
          }
        >
          {employee.is_active ? (
            <UserRoundX className="size-3.5" strokeWidth={2} />
          ) : (
            <UserCheck className="size-3.5" strokeWidth={2} />
          )}
        </Button>
      </div>
    </li>
  );
};
