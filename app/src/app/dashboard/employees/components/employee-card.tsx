"use client";

import { type FC } from "react";
import Link from "next/link";
import { Pencil, QrCode, UserRoundX, UserCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs",
        !employee.is_active && "opacity-80",
      )}
    >
      <Link
        href={Routes.dashboard.employeeDetail(employee.id)}
        className="flex items-start gap-3"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink-charcoal text-sm font-bold text-paper-offwhite">
          {initials(employee.full_name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-ink-charcoal hover:underline">
            {employee.full_name}
          </h3>
          <p className="truncate text-xs text-zinc-400">
            {employee.position?.trim() || "Team member"}
          </p>
          <span
            className={cn(
              "mt-1.5 inline-block rounded-full px-2 py-0.5 text-caption font-bold",
              employee.is_active
                ? "bg-brand-50 text-brand-700"
                : "bg-neutral-fill font-medium text-zinc-500",
            )}
          >
            {getEmployeeStatusLabel(employee.is_active)}
          </span>
        </div>
      </Link>

      <div className="space-y-1 border-t border-zinc-100 pt-3 text-xs">
        <div className="truncate text-zinc-500">{employee.email}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(employee)}
        >
          <Pencil data-icon="inline-start" className="size-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant={employee.is_active ? "destructive" : "secondary"}
          size="sm"
          className="flex-1"
          onClick={() => onToggleActive(employee)}
        >
          {employee.is_active ? (
            <UserRoundX data-icon="inline-start" className="size-3.5" />
          ) : (
            <UserCheck data-icon="inline-start" className="size-3.5" />
          )}
          {employee.is_active ? "Deactivate" : "Activate"}
        </Button>
        <Link
          href={Routes.dashboard.access}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full",
          )}
        >
          <QrCode data-icon="inline-start" className="size-3.5" />
          View QR codes
        </Link>
      </div>
    </div>
  );
};
