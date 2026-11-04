"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@/lib/i18n-zod-resolver";
import { ArrowRight } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useResetPassword } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { PasswordInput } from "@/components/ui/password-input";

export const AuthResetPasswordForm: FC = () => {
  const t = useTranslations("auth.resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetPassword = useResetPassword();

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
            {t("invalidTitle")}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {t("invalidDescription")}
          </p>
        </div>
        <Link
          href={Routes.auth.forgot_password}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline"
        >
          {t("requestNewLink")}
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="reset-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            {t("passwordLabel")}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={!!errors.password}
                {...field}
              />
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
            {t("confirmLabel")}
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="reset-confirm-password"
                autoComplete="new-password"
                placeholder={t("confirmPlaceholder")}
                aria-invalid={!!errors.confirmPassword}
                {...field}
              />
            )}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          size="lg"
          className="w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal"
        >
          {t("submit")}
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            {t("backToSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};
