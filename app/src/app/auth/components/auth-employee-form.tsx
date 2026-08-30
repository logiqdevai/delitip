"use client";

import { type FC } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Info } from "lucide-react";
import {
  employeeSignInSchema,
  type EmployeeSignInFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useLoginEmployee } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export const AuthEmployeeForm: FC = () => {
  const loginEmployee = useLoginEmployee();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeSignInFormData>({
    resolver: zodResolver(employeeSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = loginEmployee.isPending;

  const onSubmit = handleSubmit((values) => {
    loginEmployee.mutate(values);
  });

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Employee Portal
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Check your personal tip earnings, payouts, and customer reviews.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="employee-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Work Email
          </label>
          <Input
            id="employee-email"
            type="email"
            autoComplete="email"
            placeholder="maria@artisancafe.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="employee-password"
              className="text-xs font-semibold text-zinc-700"
            >
              Password
            </label>
            <Link
              href={Routes.auth.forgot_password}
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="employee-password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                aria-invalid={!!errors.password}
                {...field}
              />
            )}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-brand-200/60 bg-brand-50/60 p-3 text-xs text-brand-900">
          <Info
            className="mt-0.5 size-4 shrink-0 text-electric-lime"
            strokeWidth={2}
          />
          <span>
            Use the email and password from your staff invite. Ask your manager if you need access reset.
          </span>
        </div>

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          className="w-full rounded-xl bg-ink-charcoal text-paper-offwhite shadow hover:bg-zinc-800"
        >
          Access My Tip Profile
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          Are you an employer?{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            Business sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
