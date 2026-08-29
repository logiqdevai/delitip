"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "@/features/employees/hooks/use-employees";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import {
  employeeFormSchema,
  type EmployeeFormData,
} from "@/features/employees/validation-schemas/employees.schema";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  employee?: Employee | null;
}

export const EmployeeFormDialog: FC<EmployeeFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  employee,
}) => {
  const isEdit = !!employee;
  const createEmployee = useCreateEmployee(storeId);
  const updateEmployee = useUpdateEmployee();
  const isPending = createEmployee.isPending || updateEmployee.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      position: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    reset({
      full_name: employee?.full_name ?? "",
      email: employee?.email ?? "",
      position: employee?.position ?? "",
    });
  }, [employee, open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      full_name: values.full_name,
      email: values.email,
      position: values.position?.trim() || undefined,
    };

    try {
      if (isEdit && employee) {
        await updateEmployee.mutateAsync({ id: employee.id, payload });
      } else {
        await createEmployee.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {}
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update their profile details for tipping and QR assignment."
              : "Add a team member so customers can tip and review them."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="employee-full-name">Full name</Label>
            <Input
              id="employee-full-name"
              autoComplete="name"
              placeholder="Maria Papadopoulou"
              aria-invalid={!!errors.full_name}
              {...register("full_name")}
            />
            {errors.full_name ? (
              <p className="text-xs text-red-600">{errors.full_name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-email">Email</Label>
            <Input
              id="employee-email"
              type="email"
              autoComplete="email"
              placeholder="maria@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-position">
              Position{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="employee-position"
              placeholder="Server, barista…"
              aria-invalid={!!errors.position}
              {...register("position")}
            />
            {errors.position ? (
              <p className="text-xs text-red-600">{errors.position.message}</p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={isPending}>
              {isEdit ? "Save changes" : "Add employee"}
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
