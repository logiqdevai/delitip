"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";

export const AuthForgotPasswordForm: FC = () => {
  const forgotPassword = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isPending = forgotPassword.isPending;

  const onSubmit = handleSubmit((values) => {
    forgotPassword.mutate(values, {
      onSuccess: () => {
        setSubmittedEmail(values.email);
      },
    });
  });

  if (submittedEmail) {
    return (
      <div className="auth-fade-enter space-y-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-electric-lime">
          <CheckCircle2 className="size-6" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
            Check your email
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            If an account exists for{" "}
            <span className="font-semibold text-zinc-700">{submittedEmail}</span>
            , we sent a link to reset your password. The link expires in one
            hour.
          </p>
        </div>
        <Link
          href={Routes.auth.sign_in}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline"
        >
          Back to sign in
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Forgot password
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Enter your work email and we&apos;ll send a reset link if an account
          exists.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Email
          </label>
          <Input
            id="forgot-email"
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

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          className="w-full rounded-xl bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/30 hover:bg-brand-700"
        >
          Send reset link
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          Remembered it?{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
