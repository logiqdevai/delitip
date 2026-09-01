"use client";

import { type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/features/auth/hooks/use-auth";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const ChangePasswordForm: FC = () => {
  const changePassword = useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      confirmPassword: "",
    },
  });

  useUnsavedChangesWarning(isDirty);

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(
      {
        current_password: values.current_password,
        password: values.password,
      },
      {
        onSuccess: () => reset(),
      },
    );
  });

  return (
    <form
      onSubmit={onSubmit}
      className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
      noValidate
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Change password
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Update the password used to sign in to this login.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account-current-password">Current password</Label>
        <Controller
          name="current_password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="account-current-password"
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

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="account-new-password">New password</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="account-new-password"
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
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="account-confirm-password">
            Confirm new password
          </Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="account-confirm-password"
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
      </div>

      <div className="pt-2">
        <ActionButtonWithPending
          type="submit"
          isPending={changePassword.isPending}
        >
          Update password
        </ActionButtonWithPending>
      </div>
    </form>
  );
};
