"use client";

import { type FC } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  businessSignInSchema,
  type BusinessSignInFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useLoginBusiness } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export const AuthSignInForm: FC = () => {
  const loginBusiness = useLoginBusiness();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessSignInFormData>({
    resolver: zodResolver(businessSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = loginBusiness.isPending;

  const onSubmit = handleSubmit((values) => {
    loginBusiness.mutate(values);
  });

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Welcome back
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Sign in to manage your team, tips, and live customer reviews.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="sign-in-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Business Email
          </label>
          <Input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            placeholder="manager@artisancafe.com"
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
              htmlFor="sign-in-password"
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
                id="sign-in-password"
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

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          className="w-full rounded-xl bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/30 hover:bg-brand-700"
        >
          Sign in to delitip.com
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          New to delitip.com?{" "}
          <Link
            href={Routes.auth.sign_up}
            className="font-bold text-brand-700 hover:underline"
          >
            Create a business account
          </Link>
        </p>
      </div>
    </div>
  );
};
