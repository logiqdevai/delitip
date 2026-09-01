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

const authFieldClassName =
  "h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none";

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
    <div className="auth-fade-enter flex flex-1 flex-col">
      <div className="mb-6 hidden lg:block">
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Employee Portal
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Check your personal tip earnings, payouts, and customer reviews.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 lg:space-y-4" noValidate>
        <div>
          <label
            htmlFor="employee-email"
            className="mb-2 block text-sm font-bold text-ink-charcoal lg:mb-1.5 lg:text-xs lg:font-semibold lg:text-zinc-700"
          >
            Email
          </label>
          <Input
            id="employee-email"
            type="email"
            autoComplete="email"
            placeholder="maria@artisancafe.com"
            aria-invalid={!!errors.email}
            className={`${authFieldClassName} lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5`}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 lg:mb-1.5">
            <label
              htmlFor="employee-password"
              className="text-sm font-bold text-ink-charcoal lg:text-xs lg:font-semibold lg:text-zinc-700"
            >
              Password
            </label>
            <Link
              href={`${Routes.auth.forgot_password}?role=employee`}
              className="text-caption font-semibold text-brand-700 hover:underline"
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
                groupClassName={`${authFieldClassName} lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5`}
                {...field}
              />
            )}
          />
          {errors.password ? (
            <p className="mt-1.5 text-caption text-red-600 lg:mt-1 lg:text-xs">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-brand-200/60 bg-brand-50/60 p-3.5 text-caption text-brand-900 lg:rounded-xl lg:p-3 lg:text-xs">
          <Info
            className="mt-0.5 size-4 shrink-0 text-electric-lime"
            strokeWidth={2}
          />
          <span>
            Use the email and password from your staff invite. Ask your manager
            if you need access reset.
          </span>
        </div>

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          size="lg"
          className="mt-2 h-12 w-full rounded-full bg-ink-charcoal text-sm font-bold text-white shadow-lg shadow-ink-charcoal/20 hover:bg-zinc-800 lg:mt-0 lg:h-(--control-height-default) lg:rounded-xl lg:text-xs lg:font-semibold"
        >
          Access My Tip Profile
          <ArrowRight data-icon="inline-end" className="size-4 lg:size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="mt-auto pt-8 text-center lg:mt-0 lg:pt-2">
        <p className="text-sm text-zinc-500 lg:text-xs">
          Are you an employer?{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-800 hover:underline lg:text-brand-700"
          >
            Business sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
