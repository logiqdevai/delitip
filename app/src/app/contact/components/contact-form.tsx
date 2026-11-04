"use client";

import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ContactTopicFormOptions } from "@/config/constants/dropdowns/contact/contact-topic-form.options";
import {
  contactSchema,
  type ContactFormData,
} from "@/features/contact/validation-schemas/contact.schema";
import { useSubmitContact } from "@/features/contact/hooks/use-contact";

export const ContactForm: FC = () => {
  const t = useTranslations("contact.form");
  const submitContact = useSubmitContact();
  const [submitted, setSubmitted] = useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: ContactTopicFormOptions[0].id,
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    submitContact.mutate(values, {
      onSuccess: () => {
        trackEvent(AnalyticsEvents.contactFormSubmitted, { topic: values.topic });
        setSubmitted(values);
      },
    });
  });

  if (submitted) {
    return (
      <div className="auth-fade-enter flex flex-col items-start gap-4 rounded-3xl border border-zinc-200/80 bg-white px-4 py-6 sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
          <Check className="size-5" strokeWidth={2} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight text-ink-charcoal">
            {t("receivedTitle")}
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-zinc-500 sm:text-sm">
            {t.rich("receivedBody", {
              name: submitted.name ? `, ${submitted.name.split(" ")[0]}` : "",
              email: submitted.email,
              strong: (chunks) => (
                <span className="font-semibold text-ink-charcoal">
                  {chunks}
                </span>
              ),
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            reset();
          }}
          className="rounded-xl bg-neutral-fill px-4 py-2.5 text-xs font-bold text-ink-charcoal transition hover:scale-[1.03] hover:bg-zinc-200"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="auth-fade-enter flex h-full flex-col justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs sm:p-8"
    >
      <div className="space-y-7">
        <span className="block text-xs font-semibold text-zinc-700">
          {t("topicLabel")}
        </span>
        <Controller
          name="topic"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {ContactTopicFormOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => field.onChange(item.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-bold transition",
                    field.value === item.id
                      ? "bg-electric-lime text-ink-charcoal"
                      : "bg-neutral-fill text-zinc-600 hover:bg-zinc-200",
                  )}
                >
                  {t(`topics.${item.id}`)}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="contents">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              {t("fullName")}
            </label>
            <Input
              id="contact-name"
              type="text"
              autoComplete="name"
              placeholder={t("fullNamePlaceholder")}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              {t("email")}
            </label>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-company"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            {t("business")}{" "}
            <span className="font-medium text-zinc-400">{t("optional")}</span>
          </label>
          <Input
            id="contact-company"
            type="text"
            autoComplete="organization"
            placeholder={t("businessPlaceholder")}
            {...register("company")}
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            {t("message")}
          </label>
          <Textarea
            id="contact-message"
            rows={5}
            placeholder={t("messagePlaceholder")}
            className="min-h-28 resize-y"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      <ActionButtonWithPending
        type="submit"
        isPending={submitContact.isPending}
        className="w-full rounded-xl bg-electric-lime font-bold text-ink-charcoal"
      >
        {t("send")}
        <ArrowRight data-icon="inline-end" className="size-3.5" />
      </ActionButtonWithPending>
    </form>
  );
};
