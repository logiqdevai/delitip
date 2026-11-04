"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/i18n-zod-resolver";
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
  const t = useTranslations("auth.forgotPassword");
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "employee" ? "employee" : undefined;
  const signInHref =
    role === "employee" ? `${Routes.auth.sign_in}?role=employee` : Routes.auth.sign_in;
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
    forgotPassword.mutate(
      { ...values, role },
      {
        onSuccess: () => {
          setSubmittedEmail(values.email);
        },
      },
    );
  });

  if (submittedEmail) {
    return (
      <div className="auth-fade-enter space-y-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-electric-lime">
          <CheckCircle2 className="size-6" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
            {t("sentTitle")}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {t.rich("sentDescription", {
              b: (chunks) => (
                <span className="font-semibold text-zinc-700">{chunks}</span>
              ),
              email: submittedEmail,
            })}
          </p>
        </div>
        <Link
          href={signInHref}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline"
        >
          {t("backToSignIn")}
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
            htmlFor="forgot-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            {t("emailLabel")}
          </label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
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
          size="lg"
          className="w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal"
        >
          {t("submit")}
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          {t("remembered")}{" "}
          <Link
            href={signInHref}
            className="font-bold text-brand-700 hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};
