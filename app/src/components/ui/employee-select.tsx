"use client";

import { type FC, useId } from "react";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type EmployeeSelectOption = {
  id: string;
  full_name: string;
  position?: string | null;
  photo_document?: { url: string } | null;
};

export type EmployeeSelectProps = {
  employees: EmployeeSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
  allLabel?: string;
  allValue?: string;
  placeholder?: string;
  emptyValue?: string;
  emptyLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default";
  showPosition?: boolean;
  "aria-label"?: string;
};

export const EmployeeSelect: FC<EmployeeSelectProps> = ({
  employees,
  value,
  onValueChange,
  includeAll = false,
  allLabel = "All employees",
  allValue = "all",
  placeholder = "Select employee",
  emptyValue,
  emptyLabel = "Select employee",
  disabled = false,
  invalid = false,
  id: idProp,
  className,
  triggerClassName,
  contentClassName,
  size = "default",
  showPosition = false,
  "aria-label": ariaLabel,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const items = [
    ...(includeAll ? [{ label: allLabel, value: allValue }] : []),
    ...(emptyValue !== undefined
      ? [{ label: emptyLabel, value: emptyValue }]
      : []),
    ...employees.map((employee) => ({
      label: employee.full_name,
      value: employee.id,
    })),
  ];

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        className={cn(className, triggerClassName)}
      >
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => {
            if (selected === null) return null;
            if (includeAll && selected === allValue) return allLabel;
            if (emptyValue !== undefined && selected === emptyValue) {
              return emptyLabel;
            }
            const employee = employees.find((item) => item.id === selected);
            if (!employee) return null;
            return (
              <>
                <EmployeeAvatar
                  name={employee.full_name}
                  photoUrl={employee.photo_document?.url}
                  size="xs"
                />
                <span className="min-w-0 truncate">{employee.full_name}</span>
              </>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className={cn("w-auto min-w-48", contentClassName)}>
        <SelectGroup>
          {includeAll ? (
            <SelectItem value={allValue}>{allLabel}</SelectItem>
          ) : null}
          {emptyValue !== undefined ? (
            <SelectItem value={emptyValue}>{emptyLabel}</SelectItem>
          ) : null}
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              <EmployeeAvatar
                name={employee.full_name}
                photoUrl={employee.photo_document?.url}
                size="xs"
              />
              <span className="min-w-0">
                <span className="block truncate">{employee.full_name}</span>
                {showPosition && employee.position ? (
                  <span className="block truncate text-xs text-zinc-400">
                    {employee.position}
                  </span>
                ) : null}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
