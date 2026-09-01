"use client";

import { type FC } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/features/auth/hooks/use-auth";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";

interface EmployeeChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmployeeChangePasswordDialog: FC<
  EmployeeChangePasswordDialogProps
> = ({ open, onOpenChange }) => {
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isPending = changePassword.isPending;

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(
      {
        current_password: values.current_password,
        password: values.password,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-sm" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Update the password used to sign in to your tip profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="employee-current-password">
              Current password
            </Label>
            <Controller
              name="current_password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="employee-current-password"
                  autoComplete="current-password"
                  placeholder="Your current password"
                  aria-invalid={!!errors.current_password}
                  {...field}
                />
              )}
            />
            {errors.current_password ? (
              <p className="text-xs text-red-600">
                {errors.current_password.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-new-password">New password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="employee-new-password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={!!errors.password}
                  {...field}
                />
              )}
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="employee-confirm-password">
              Confirm new password
            </Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  id="employee-confirm-password"
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  aria-invalid={!!errors.confirmPassword}
                  {...field}
                />
              )}
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={isPending}>
              Update password
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
