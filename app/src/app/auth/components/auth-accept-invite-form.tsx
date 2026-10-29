"use client";

import { type FC } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import {
  useAcceptInvite,
  useInviteInfo,
} from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import { Input } from "@/components/ui/input";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { PasswordInput } from "@/components/ui/password-input";

export const AuthAcceptInviteForm: FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const acceptInvite = useAcceptInvite();
  const inviteInfo = useInviteInfo(token);

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

  const isPending = acceptInvite.isPending;

  const onSubmit = handleSubmit((values) => {
    acceptInvite.mutate({
      token,
      password: values.password,
    });
  });

  if (!token || inviteInfo.isError) {
    return (
      <div className="auth-fade-enter space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
            Invalid invite link
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {token
              ? "This invite link is invalid or has expired."
              : "This invite link is missing a token."}{" "}
            Ask your store owner to resend your invite.
          </p>
        </div>
        <Link
          href={`${Routes.auth.sign_in}?role=employee`}
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
          Welcome to delitip
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Set a password to activate your account and start receiving tips.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="invite-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Email
          </label>
          <Input
            id="invite-email"
            type="email"
            value={inviteInfo.data?.email ?? ""}
            placeholder={inviteInfo.isPending ? "Loading…" : ""}
            disabled
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="invite-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="invite-password"
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

        <div>
          <label
            htmlFor="invite-confirm-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Confirm password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="invite-confirm-password"
                autoComplete="new-password"
                placeholder="Repeat password"
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
          className="h-12 w-full rounded-full bg-electric-lime text-sm font-bold text-ink-charcoal hover:scale-[1.03]"
        >
          Activate account
          <ArrowRight data-icon="inline-end" className="size-3.5" />
        </ActionButtonWithPending>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          <Link
            href={`${Routes.auth.sign_in}?role=employee`}
            className="font-bold text-brand-700 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
