"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useResetPassword } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { authFieldClassName } from "./auth-password-field";
import { cn } from "@/lib/utils";

export const AuthResetPasswordForm: FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetPassword = useResetPassword();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isPending = resetPassword.isPending;

  const onSubmit = handleSubmit((values) => {
    resetPassword.mutate({
      token,
      password: values.password,
    });
  });

  if (!token) {
    return (
      <div className="auth-fade-enter space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
            Invalid reset link
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            This password reset link is missing a token. Request a new link from
            the forgot password page.
          </p>
        </div>
        <Link
          href={Routes.auth.forgot_password}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline"
        >
          Request a new link
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Set a new password
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Choose a new password for your delitip account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="reset-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            New password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  id="reset-password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={cn(authFieldClassName, "pr-10")}
                  aria-invalid={!!errors.password}
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <EyeOff className="size-4" strokeWidth={2} />
                  ) : (
                    <Eye className="size-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            )}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="reset-confirm-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Confirm password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={confirmVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className={cn(authFieldClassName, "pr-10")}
                  aria-invalid={!!errors.confirmPassword}
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setConfirmVisible((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label={
                    confirmVisible ? "Hide password" : "Show password"
                  }
                >
                  {confirmVisible ? (
                    <EyeOff className="size-4" strokeWidth={2} />
                  ) : (
                    <Eye className="size-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            )}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-lime py-3 text-xs font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>Update password</span>
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
