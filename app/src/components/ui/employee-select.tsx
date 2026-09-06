"use client";

import { type FC, useId } from "react";
import { UserPlus } from "lucide-react";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CREATE_NEW_VALUE = "__create_new_employee__";

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
  onCreateNew?: () => void;
  createNewLabel?: string;
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
  onCreateNew,
  createNewLabel = "Add employee",
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
    ...(onCreateNew ? [{ label: createNewLabel, value: CREATE_NEW_VALUE }] : []),
  ];

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next === CREATE_NEW_VALUE) {
          onCreateNew?.();
          return;
        }
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
            if (selected === null || selected === CREATE_NEW_VALUE) return null;
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
      <SelectContent className={cn(contentClassName)}>
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
        {onCreateNew ? (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectItem
                value={CREATE_NEW_VALUE}
                className="text-brand-800 focus:text-brand-800"
              >
                <UserPlus className="size-4 shrink-0" strokeWidth={2} />
                <span className="truncate font-semibold">{createNewLabel}</span>
              </SelectItem>
            </SelectGroup>
          </>
        ) : null}
      </SelectContent>
    </Select>
  );
};
