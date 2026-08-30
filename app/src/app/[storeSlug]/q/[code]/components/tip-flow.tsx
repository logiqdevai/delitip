"use client";

import { type CSSProperties, type FC, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PublicQrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { PublicStore } from "@/features/stores/interfaces/stores.interfaces";
import type { CreatePublicTipResponse } from "@/features/tips/interfaces/tips.interfaces";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import { usePublicReviewConfig } from "@/features/reviews/hooks/use-reviews";
import { getReadableTextColor } from "@/lib/color";
import { Routes } from "@/routes/routes";
import { StoreHero } from "@/app/[storeSlug]/q/[code]/components/store-hero";
import { AmountStep } from "@/app/[storeSlug]/q/[code]/components/steps/amount-step";
import { RecipientStep } from "@/app/[storeSlug]/q/[code]/components/steps/recipient-step";
import {
  ReviewStep,
  emptyReviewDraft,
  type ReviewDraft,
} from "@/app/[storeSlug]/q/[code]/components/steps/review-step";
import { DoneStep } from "@/app/[storeSlug]/q/[code]/components/steps/done-step";

interface TipFlowProps {
  storeSlug: string;
  store: PublicStore;
  qr: PublicQrCode;
}

type FlowStep = "amount" | "select" | "review" | "done";

const TIP_QUERY_PARAM = "tip";
const DEFAULT_PRIMARY_COLOR = "#C8F169";
const DEFAULT_SECONDARY_COLOR = "#9FBF3E";

export const TipFlow: FC<TipFlowProps> = ({ storeSlug, store, qr }) => {
  const { data: reviewConfig } = usePublicReviewConfig(storeSlug);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const recoveredTipId = searchParams.get(TIP_QUERY_PARAM);

  const employees = qr.employees;
  const mode = qr.qr_code.selection_mode;
  const interactive =
    employees.length > 1 &&
    (mode === "CHOOSE_ONE" || mode === "CHOOSE_MANY");

  const initialSelectedIds = useMemo(() => {
    if (employees.length === 0) return [];
    if (employees.length === 1) return [employees[0].id];
    if (mode === "TEAM") return employees.map((employee) => employee.id);
    return [];
  }, [employees, mode]);

  const [step, setStep] = useState<FlowStep>(
    recoveredTipId ? "done" : "amount",
  );
  const [selectedEmployeeIds, setSelectedEmployeeIds] =
    useState<string[]>(initialSelectedIds);
  const [amount, setAmount] = useState(0);
  const [tipResult, setTipResult] = useState<CreatePublicTipResponse | null>(
    null,
  );
  const [reviewResult, setReviewResult] =
    useState<CreatePublicReviewResponse | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft>(emptyReviewDraft);

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds((current) => {
      if (mode === "CHOOSE_MANY") {
        return current.includes(id)
          ? current.filter((existing) => existing !== id)
          : [...current, id];
      }
      return [id];
    });
  };

  const recipientLabel =
    employees.length === 0
      ? store.name
      : selectedEmployeeIds.length === 0
        ? "the team"
        : employees
            .filter((employee) => selectedEmployeeIds.includes(employee.id))
            .map((employee) => employee.full_name)
            .join(" & ");

  const primary =
    store.primary_color?.trim() ||
    qr.store.primary_color?.trim() ||
    DEFAULT_PRIMARY_COLOR;
  const secondary =
    store.secondary_color?.trim() ||
    qr.store.secondary_color?.trim() ||
    DEFAULT_SECONDARY_COLOR;
  const primaryForeground = getReadableTextColor(primary);
  const themeStyle = {
    "--tip-primary": primary,
    "--tip-secondary": secondary,
    "--tip-primary-foreground": primaryForeground,
  } as CSSProperties;
  const logoUrl = store.logo_url ?? qr.store.logo_url;
  const welcome =
    store.welcome_message?.trim() ||
    `Welcome to ${store.name}. Leave a tip for great service.`;

  const resetFlow = () => {
    setStep("amount");
    setSelectedEmployeeIds(initialSelectedIds);
    setAmount(0);
    setTipResult(null);
    setReviewResult(null);
    setReviewDraft(emptyReviewDraft);
    router.replace(pathname, { scroll: false });
  };

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper-offwhite"
      style={themeStyle}
    >
      {step === "amount" ? (
        <div className="flex flex-1 flex-col">
          <StoreHero
            store={store}
            logoUrl={logoUrl}
            primary={primary}
            secondary={secondary}
            welcome={welcome}
          />
          <AmountStep
            currency={store.currency}
            suggestedAmounts={store.suggested_tip_amounts}
            allowCustomAmount={store.allow_custom_tip_amount}
            subtitle={interactive ? undefined : `for ${recipientLabel}`}
            recipientLabel={recipientLabel}
            onContinue={(value) => {
              setAmount(value);
              setStep("select");
            }}
          />
        </div>
      ) : null}

      {step === "select" ? (
        <RecipientStep
          storeName={store.name}
          employees={employees}
          mode={mode}
          interactive={interactive}
          selectedEmployeeIds={selectedEmployeeIds}
          onToggle={toggleEmployee}
          onBack={() => setStep("amount")}
          onContinue={() => setStep("review")}
        />
      ) : null}

      {step === "review" ? (
        <ReviewStep
          qrCodeId={qr.qr_code.id}
          storeId={store.id}
          amount={amount}
          currency={store.currency}
          recipientLabel={recipientLabel}
          selectionMode={mode}
          selectedEmployeeIds={selectedEmployeeIds}
          config={reviewConfig}
          draft={reviewDraft}
          onChange={setReviewDraft}
          onBack={() => setStep("select")}
          onSuccess={(tip, review) => {
            setTipResult(tip);
            setReviewResult(review);
            setStep("done");
            router.replace(`${pathname}?${TIP_QUERY_PARAM}=${tip.tip.id}`, {
              scroll: false,
            });
          }}
        />
      ) : null}

      {step === "done" && (tipResult || recoveredTipId) ? (
        <DoneStep
          review={reviewResult}
          tipId={tipResult?.tip.id ?? recoveredTipId!}
          amount={tipResult?.tip.amount}
          currency={tipResult?.tip.currency}
          storeName={tipResult ? store.name : undefined}
          recipientLabel={tipResult ? recipientLabel : undefined}
          thankYouMessage={tipResult?.thank_you_message}
          onRestart={resetFlow}
        />
      ) : null}

      <footer className="border-t border-zinc-100 px-5 py-4 text-center text-[11px] font-medium text-zinc-400">
        Powered by{" "}
        <Link
          href={Routes.home}
          className="font-semibold text-zinc-700 transition hover:text-ink-charcoal"
        >
          delitip.com
        </Link>{" "}
        • Transparent & Secure
      </footer>
    </main>
  );
};
