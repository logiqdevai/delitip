"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@/lib/i18n-zod-resolver";
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
  const t = useTranslations("auth.signUp");
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
          {t("title")}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sign-up-name"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              {t("fullNameLabel")}
            </label>
            <Input
              id="sign-up-name"
              type="text"
              autoComplete="name"
              placeholder={t("fullNamePlaceholder")}
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
              {t("emailLabel")}
            </label>
            <Input
              id="sign-up-email"
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
        </div>

        <div>
          <label
            htmlFor="sign-up-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            {t("passwordLabel")}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="sign-up-password"
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

        <p className="text-xs leading-relaxed text-zinc-400">
          {t.rich("consent", {
            terms: (chunks) => (
              <Link
                href={Routes.legal.terms}
                className="font-medium text-zinc-700 underline"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link
                href={Routes.legal.privacy}
                className="font-medium text-zinc-700 underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>

        <ActionButtonWithPending
          type="submit"
          isPending={isPending}
          className="w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal"
        >
          {t("submit")}
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          {t("alreadyRegistered")}{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            {t("signInInstead")}
          </Link>
        </p>
      </div>
    </div>
  );
};
