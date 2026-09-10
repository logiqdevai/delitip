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
import { cn } from "@/lib/utils";

const authFieldClassName =
  "h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 px-4 text-sm shadow-none";

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
    <div className="auth-fade-enter flex flex-1 flex-col">
      <div className="mb-6 hidden lg:block">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink-charcoal">
          Welcome back
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
          Sign in to manage your team, tips, and live customer reviews.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 lg:space-y-4" noValidate>
        <div>
          <label
            htmlFor="sign-in-email"
            className="mb-2 block text-sm font-bold text-ink-charcoal lg:mb-1.5 lg:text-xs lg:font-semibold lg:text-zinc-700"
          >
            Business Email
          </label>
          <Input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            placeholder="manager@artisancafe.com"
            aria-invalid={!!errors.email}
            className={cn(authFieldClassName, "lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5")}
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
              htmlFor="sign-in-password"
              className="text-sm font-bold text-ink-charcoal lg:text-xs lg:font-semibold lg:text-zinc-700"
            >
              Password
            </label>
            <Link
              href={Routes.auth.forgot_password}
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
                id="sign-in-password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                aria-invalid={!!errors.password}
                groupClassName={cn(
                  authFieldClassName,
                  "lg:h-(--control-height-default) lg:rounded-xl lg:px-3.5"
                )}
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

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          size="lg"
          className="mt-2 h-12 w-full rounded-full bg-electric-lime text-sm font-bold text-ink-charcoal shadow-[0_10px_28px_rgba(200,241,105,0.45)] hover:bg-brand-300 lg:mt-1 lg:h-11 lg:rounded-xl lg:text-sm lg:font-bold lg:shadow-[0_12px_28px_rgba(200,241,105,0.35)] lg:hover:bg-brand-300"
        >
          Sign in to delitip
          <ArrowRight data-icon="inline-end" className="size-4 lg:size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="mt-auto pt-8 text-center lg:mt-0 lg:pt-2">
        <p className="text-sm text-zinc-500 lg:text-xs">
          New to delitip?{" "}
          <Link
            href={Routes.auth.sign_up}
            className="font-bold text-brand-800 hover:underline lg:text-brand-700"
          >
            Create a business account
          </Link>
        </p>
      </div>
    </div>
  );
};
