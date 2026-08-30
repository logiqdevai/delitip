"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  businessSignInSchema,
  type BusinessSignInFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useLoginBusiness } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { authFieldClassName } from "./auth-password-field";
import { cn } from "@/lib/utils";

export const AuthSignInForm: FC = () => {
  const loginBusiness = useLoginBusiness();
  const [passwordVisible, setPasswordVisible] = useState(false);

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
          <input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            placeholder="manager@artisancafe.com"
            className={authFieldClassName}
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
              <div className="relative">
                <input
                  id="sign-in-password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
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

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-lime py-3 text-xs font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in to delitip.com</span>
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </>
          )}
        </button>
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
