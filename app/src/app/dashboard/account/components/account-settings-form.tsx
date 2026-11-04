"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/i18n-zod-resolver";
import { useTranslations } from "next-intl";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useUpdateMe } from "@/features/users/hooks/use-users";
import {
  userProfileFormSchema,
  type UserProfileFormData,
} from "@/features/users/validation-schemas/users.schema";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const AccountSettingsForm: FC = () => {
  const t = useTranslations("dashboard.shell.account.profile");
  const { data: profile, isPending } = useMe();
  const updateMe = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile, reset]);

  useUnsavedChangesWarning(isDirty);

  const onSubmit = handleSubmit((values) => {
    updateMe.mutate({
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone || undefined,
    });
  });

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
  }

  if (!profile) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs"
      noValidate
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          {t("title")}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="account-first-name">{t("firstName")}</Label>
          <Input
            id="account-first-name"
            placeholder={t("firstName")}
            aria-invalid={!!errors.first_name}
            {...register("first_name")}
          />
          {errors.first_name ? (
            <p className="text-xs text-red-600">
              {errors.first_name.message}
            </p>
          ) : null}
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="account-last-name">{t("lastName")}</Label>
          <Input
            id="account-last-name"
            placeholder={t("lastName")}
            aria-invalid={!!errors.last_name}
            {...register("last_name")}
          />
          {errors.last_name ? (
            <p className="text-xs text-red-600">{errors.last_name.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account-email">{t("email")}</Label>
        <Input
          id="account-email"
          value={profile.email ?? ""}
          disabled
          readOnly
        />
        <p className="text-xs text-zinc-500">
          {t("emailHelp")}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="account-phone">{t("phone")}</Label>
        <Input
          id="account-phone"
          placeholder={t("phonePlaceholder")}
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-xs text-red-600">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="pt-2">
        <ActionButtonWithPending type="submit" isPending={updateMe.isPending}>
          {t("save")}
        </ActionButtonWithPending>
      </div>
    </form>
  );
};
