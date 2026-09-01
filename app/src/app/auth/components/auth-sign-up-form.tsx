"use client";

import { type FC } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  businessSignUpSchema,
  type BusinessSignUpFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useRegisterBusiness } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export const AuthSignUpForm: FC = () => {
  const registerBusiness = useRegisterBusiness();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessSignUpFormData>({
    resolver: zodResolver(businessSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const isPending = registerBusiness.isPending;

  const onSubmit = handleSubmit((values) => {
    registerBusiness.mutate(values);
  });

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Register your business
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Start collecting tips and employee feedback in under 2 minutes.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sign-up-name"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Your Full Name
            </label>
            <Input
              id="sign-up-name"
              type="text"
              autoComplete="name"
              placeholder="John Miller"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="sign-up-email"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Email
            </label>
            <Input
              id="sign-up-email"
              type="email"
              autoComplete="email"
              placeholder="john@artisancafe.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="sign-up-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Create Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="sign-up-password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
                {...field}
              />
            )}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <p className="text-xs leading-relaxed text-zinc-400">
          By registering, you agree to delitip.com’s{" "}
          <Link
            href={Routes.legal.terms}
            className="font-medium text-zinc-700 underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={Routes.legal.privacy}
            className="font-medium text-zinc-700 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          size="lg"
          className="h-12 w-full rounded-full bg-electric-lime text-sm font-bold text-ink-charcoal shadow-[0_10px_28px_rgba(200,241,105,0.45)] hover:bg-brand-300"
        >
          Create Business Account
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          Already registered?{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};
