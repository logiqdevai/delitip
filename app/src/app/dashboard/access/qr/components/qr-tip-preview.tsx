"use client";

import { type FC, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { NextIntlClientProvider } from "next-intl";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { parseTipAmounts } from "@/app/dashboard/access/qr/hooks/use-qr-editor-defaults";
import { TipFlow, type FlowStep } from "@/app/[storeSlug]/q/[code]/components/tip-flow";
import type { TipLocale } from "@/app/[storeSlug]/q/[code]/lib/locale-store";
import { TIP_PAGE_UI_LANGUAGES } from "@/app/[storeSlug]/q/[code]/lib/supported-ui-languages";
import { MESSAGES_BY_LOCALE } from "@/app/[storeSlug]/q/[code]/messages";
import { LanguagePicker } from "@/components/ui/language-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import type {
  PublicQrCode,
  PublicQrCodeEmployee,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useFeedbackQuestions } from "@/features/feedback-questions/hooks/use-feedback-questions";
import { useReviewCategories } from "@/features/review-categories/hooks/use-review-categories";
import { usePublicReviewConfig } from "@/features/reviews/hooks/use-reviews";
import type {
  Language,
  PublicStore,
} from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

const PREVIEW_STEPS: { id: FlowStep; label: string; needsRecipients?: boolean }[] =
  [
    { id: "amount", label: "Amount" },
    { id: "select", label: "Recipient", needsRecipients: true },
    { id: "review", label: "Review" },
    { id: "done", label: "Done" },
  ];

const FALLBACK_PREVIEW_AMOUNT = 500;

function resolveTranslation(
  messages: Record<string, string>,
  locale: TipLocale,
  primaryLanguage: Language,
): string | null {
  return (
    messages[locale]?.trim() ||
    messages[primaryLanguage.toLowerCase()]?.trim() ||
    null
  );
}

export const QrTipPreview: FC = () => {
  const { form, store, qr } = useQrEditor();
  const values = useDeferredValue(useWatch({ control: form.control }));
  const [requestedStep, setRequestedStep] = useState<FlowStep>("amount");
  const [requestedLocale, setRequestedLocale] = useState<TipLocale | null>(
    null,
  );
  const [restartCount, setRestartCount] = useState(0);

  const employeesQuery = useEmployees(store.id, { limit: 100 });
  const reviewConfigQuery = usePublicReviewConfig(store.slug);
  const categoriesQuery = useReviewCategories(store.id);
  const questionsQuery = useFeedbackQuestions(store.id);
  const { refetch: refetchReviewConfig } = reviewConfigQuery;

  // The review panel edits categories/questions through their own queries, so
  // refresh the public review config the preview reads whenever they change.
  useEffect(() => {
    void refetchReviewConfig();
  }, [
    categoriesQuery.dataUpdatedAt,
    questionsQuery.dataUpdatedAt,
    refetchReviewConfig,
  ]);

  const storeValues = values.store;
  const qrValues = values.qr;

  const offeredLanguages = useMemo(() => {
    const supported = (storeValues?.supported_languages ?? []).filter(
      (language): language is Language =>
        !!language && TIP_PAGE_UI_LANGUAGES.includes(language),
    );
    return supported.length ? supported : (["EN"] as Language[]);
  }, [storeValues?.supported_languages]);

  const selectedEmployeeIds = useMemo(
    () => (qrValues?.employee_ids ?? []).filter((id): id is string => !!id),
    [qrValues?.employee_ids],
  );

  const employees = useMemo<PublicQrCodeEmployee[]>(() => {
    const byId = new Map(
      (employeesQuery.data?.data ?? []).map((employee) => [
        employee.id,
        employee,
      ]),
    );
    return selectedEmployeeIds.flatMap((id) => {
      const employee = byId.get(id);
      if (!employee) return [];
      return [
        {
          id: employee.id,
          full_name: employee.full_name,
          position: employee.position,
          photo_url: employee.photo_document?.url ?? null,
        },
      ];
    });
  }, [employeesQuery.data, selectedEmployeeIds]);

  if (!storeValues || !qrValues) {
    return <Skeleton className="h-[640px] w-full rounded-[2rem]" />;
  }

  const primaryLanguage = storeValues.primary_language ?? store.primary_language;
  const defaultLocale = (
    offeredLanguages.includes(primaryLanguage)
      ? primaryLanguage
      : offeredLanguages[0]
  ).toLowerCase() as TipLocale;
  const locale =
    requestedLocale &&
    offeredLanguages.includes(requestedLocale.toUpperCase() as Language)
      ? requestedLocale
      : defaultLocale;

  const hasRecipients = employees.length > 0;
  const steps = PREVIEW_STEPS.filter(
    (step) => !step.needsRecipients || hasRecipients,
  );
  const step = steps.some((item) => item.id === requestedStep)
    ? requestedStep
    : "amount";

  const amounts = parseTipAmounts(
    (storeValues.suggested_tip_amounts ?? []).filter(
      (amount): amount is string => typeof amount === "string",
    ),
  );
  const previewAmount = amounts[0] ?? FALLBACK_PREVIEW_AMOUNT;

  const welcome = resolveTranslation(
    (storeValues.welcome_message ?? {}) as Record<string, string>,
    locale,
    primaryLanguage,
  );
  const thankYou = resolveTranslation(
    (storeValues.thank_you_message ?? {}) as Record<string, string>,
    locale,
    primaryLanguage,
  );
  const primaryColor = storeValues.primary_color ?? store.primary_color ?? null;
  const secondaryColor =
    storeValues.secondary_color ?? store.secondary_color ?? null;
  const selectionMode = employees.length >= 2 ? qrValues.selection_mode : "CHOOSE_ONE";

  const publicStore: PublicStore = {
    id: store.id,
    name: store.name,
    slug: store.slug,
    industry: store.industry,
    logo_url: store.logo_document?.url ?? null,
    cover_url: store.cover_document?.url ?? null,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    welcome_message: welcome,
    thank_you_message: thankYou,
    currency: store.currency,
    suggested_tip_amounts: amounts,
    allow_custom_tip_amount: storeValues.allow_custom_tip_amount ?? true,
    primary_language: primaryLanguage,
    supported_languages: offeredLanguages,
    public_review_rating_threshold: storeValues.public_review_rating_threshold,
  };

  const publicQr: PublicQrCode = {
    qr_code: {
      id: qr?.id ?? "preview",
      label: qrValues.label || qr?.label || "Preview",
      selection_mode: selectionMode ?? "CHOOSE_ONE",
    },
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      currency: store.currency,
      suggested_tip_amounts: amounts,
      allow_custom_tip_amount: publicStore.allow_custom_tip_amount,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      logo_url: publicStore.logo_url,
    },
    spots: [],
    employees,
  };

  // The flow keeps its own state (amount, selection), so remount it when the
  // inputs it only reads once change: step jumps, language, recipients, mode.
  const flowKey = [
    step,
    locale,
    restartCount,
    selectionMode,
    selectedEmployeeIds.join(","),
  ].join("|");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Preview step"
          className="inline-flex rounded-full bg-zinc-100 p-0.5"
        >
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={step === item.id}
              onClick={() => {
                setRequestedStep(item.id);
                setRestartCount((count) => count + 1);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                step === item.id
                  ? "bg-white text-ink-charcoal shadow-xs"
                  : "text-zinc-500 hover:text-ink-charcoal",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {offeredLanguages.length > 1 ? (
          <LanguagePicker
            value={locale.toUpperCase() as Language}
            onValueChange={(value) =>
              setRequestedLocale(value.toLowerCase() as TipLocale)
            }
            languages={offeredLanguages}
            labelSource="native"
            compact
            size="sm"
            aria-label="Preview language"
          />
        ) : null}
      </div>

      <div className="mx-auto h-[640px] w-full max-w-[360px] overflow-hidden rounded-[2rem] border-[6px] border-ink-charcoal bg-paper-offwhite shadow-xl">
        <div className="h-full overflow-y-auto overscroll-contain">
          <NextIntlClientProvider
            locale={locale}
            messages={MESSAGES_BY_LOCALE[locale]}
          >
            <TipFlow
              key={flowKey}
              storeSlug={store.slug}
              code={qr?.code ?? "preview"}
              store={publicStore}
              qr={publicQr}
              preview={{
                step,
                amount: previewAmount,
                reviewConfig: reviewConfigQuery.data,
              }}
            />
          </NextIntlClientProvider>
        </div>
      </div>
      <p className="text-center text-[11px] text-zinc-400">
        Live preview — nothing here creates a real tip.
      </p>
    </div>
  );
};
