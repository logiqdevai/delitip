"use client";

import { type FC, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  RotateCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreatePublicRefundRequest } from "@/features/refunds/hooks/use-refunds";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import {
  StoreIndustries,
  type Currency,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

// Fires a couple of side cannons plus a center burst, colored from the
// store's theme so the celebration matches the brand instead of looking generic.
const celebrate = (colors: string[]) => {
  const duration = 1200;
  const end = Date.now() + duration;

  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.3 },
    colors,
  });

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};

interface DoneStepProps {
  review: CreatePublicReviewResponse | null;
  tipId: string;
  amount?: number;
  currency?: Currency;
  storeName?: string;
  industry?: StoreIndustry;
  recipientLabel?: string;
  thankYouMessage?: string;
  /** Skips the confetti burst (used by the dashboard preview). */
  disableCelebration?: boolean;
  onRestart: () => void;
}

// Refund requests are hidden for now; flip to true to bring them back.
const SHOW_REFUND_REQUEST = false;

// Shows a prev/next picker that cycles every industry illustration.
const SHOW_ILLUSTRATION_TESTER = false;

const RefundRequest: FC<{
  tipId: string;
  amount?: number;
  currency?: Currency;
}> = ({ tipId, amount, currency }) => {
  const t = useTranslations("doneStep.refund");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const requestRefund = useCreatePublicRefundRequest();
  const amountLabel =
    amount !== undefined && currency ? formatMoney(amount, currency) : null;

  if (requestRefund.isSuccess) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-(--tip-primary)/30 bg-(--tip-primary)/10 px-4 py-3 text-left text-xs text-ink-charcoal">
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0 text-(--tip-secondary)"
          strokeWidth={2}
        />
        <span>
          {amountLabel
            ? t("successWithAmount", { amount: amountLabel })
            : t("successNoAmount")}
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto block text-[11px] font-medium text-zinc-400 hover:text-zinc-600 hover:underline"
      >
        {t("prompt")}
      </button>
    );
  }

  return (
    <div className="space-y-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left">
      <p className="text-xs font-semibold text-ink-charcoal">
        {amountLabel
          ? t("requestTitle", { amount: amountLabel })
          : t("requestTitleNoAmount")}
      </p>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={t("reasonPlaceholder")}
        rows={2}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-(--tip-primary) focus:ring-2 focus:ring-(--tip-primary) focus:outline-none"
      />

      {requestRefund.isError ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-[11px] text-red-700">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          <span>
            {requestRefund.error instanceof Error
              ? requestRefund.error.message
              : t("genericError")}
          </span>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={requestRefund.isPending}
          onClick={() =>
            requestRefund.mutate({
              tipId,
              payload: { reason: reason.trim() || undefined },
            })
          }
          className="flex-1 rounded-xl bg-(--tip-primary) py-2 text-xs font-semibold text-(--tip-primary-foreground) shadow-md shadow-(--tip-primary)/25 transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-60"
        >
          {requestRefund.isPending ? t("submitting") : t("submit")}
        </button>
        <button
          type="button"
          disabled={requestRefund.isPending}
          onClick={() => setOpen(false)}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export const DoneStep: FC<DoneStepProps> = ({
  review,
  tipId,
  amount,
  currency,
  storeName,
  industry,
  recipientLabel,
  disableCelebration = false,
  onRestart,
}) => {
  const t = useTranslations("doneStep");
  const receiptCode = `#${tipId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const industries = Object.values(StoreIndustries);
  const [industryIndex, setIndustryIndex] = useState(
    Math.max(0, industry ? industries.indexOf(industry) : 0),
  );
  const shownIndustry = SHOW_ILLUSTRATION_TESTER
    ? industries[industryIndex]
    : industry;
  // The store's custom thank-you message is intentionally not shown here: it
  // duplicates the "Thank you!" heading.
  const description =
    amount !== undefined && currency !== undefined
      ? t(review ? "descriptionWithReview" : "descriptionWithoutReview", {
          amount: formatMoney(amount, currency),
          recipient: recipientLabel ?? "",
        })
      : t("descriptionNoDetails");

  const illustrationUrl = shownIndustry
    ? `url(/brand/done/${shownIndustry.toLowerCase().replace(/_/g, "-")}.png)`
    : undefined;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableCelebration) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const styles = rootRef.current ? getComputedStyle(rootRef.current) : null;
    const primary = styles?.getPropertyValue("--tip-primary").trim();
    const secondary = styles?.getPropertyValue("--tip-secondary").trim();
    const colors = [
      primary || "#C8F169",
      secondary || "#9FBF3E",
      "#FFD166",
      "#FFFFFF",
    ];

    const timer = window.setTimeout(() => celebrate(colors), 150);
    return () => window.clearTimeout(timer);
  }, [disableCelebration]);

  return (
    <motion.div
      ref={rootRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-1 flex-col gap-5 px-4 pt-14 pb-8 text-center"
    >
      {shownIndustry ? (
        <motion.div
          variants={itemVariants}
          aria-hidden
          className="relative mx-auto aspect-square w-full max-w-[280px]"
        >
          <div className="absolute inset-x-6 top-6 bottom-0 rounded-full bg-(--tip-primary)/10" />
          <div
            className="absolute inset-0 bg-(--tip-secondary) opacity-90"
            style={{
              maskImage: illustrationUrl,
              WebkitMaskImage: illustrationUrl,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        </motion.div>
      ) : null}

      {SHOW_ILLUSTRATION_TESTER ? (
        <div className="flex items-center justify-between rounded-full border border-dashed border-zinc-300 px-2 py-1 text-xs text-zinc-600">
          <button
            type="button"
            className="rounded-full px-3 py-1 font-semibold hover:bg-zinc-100"
            onClick={() =>
              setIndustryIndex(
                (i) => (i - 1 + industries.length) % industries.length,
              )
            }
          >
            ← Prev
          </button>
          <span>
            {shownIndustry} ({industryIndex + 1}/{industries.length})
          </span>
          <button
            type="button"
            className="rounded-full px-3 py-1 font-semibold hover:bg-zinc-100"
            onClick={() => setIndustryIndex((i) => (i + 1) % industries.length)}
          >
            Next →
          </button>
        </div>
      ) : null}

      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-3xl font-bold text-ink-charcoal">
          {t("heading")}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-zinc-100"
      >
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--tip-primary)/10 text-(--tip-secondary)">
            <FileText className="size-5" strokeWidth={2} />
          </span>
          <p className="font-serif text-base font-bold text-ink-charcoal">
            {t("receiptTitle")}
          </p>
        </div>
        <div className="divide-y divide-zinc-100 text-sm">
          <div className="flex items-center justify-between gap-3 py-3 text-zinc-500">
            <span className="shrink-0">{t("receiptIdLabel")}</span>
            <span className="min-w-0 truncate font-mono font-semibold text-ink-charcoal">
              {receiptCode}
            </span>
          </div>
          {storeName ? (
            <div className="flex items-center justify-between gap-3 py-3 text-zinc-500">
              <span className="shrink-0">{t("businessLabel")}</span>
              <span className="min-w-0 truncate font-medium text-ink-charcoal">
                {storeName}
              </span>
            </div>
          ) : null}
          {recipientLabel ? (
            <div className="flex items-center justify-between gap-3 pt-3 text-zinc-500">
              <span className="shrink-0">{t("recipientLabel")}</span>
              <span className="min-w-0 truncate font-medium text-ink-charcoal">
                {recipientLabel}
              </span>
            </div>
          ) : null}
        </div>
      </motion.div>

      {review?.redirect.should_redirect && review.redirect.url ? (
        <motion.a
          variants={itemVariants}
          href={review.redirect.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-(--tip-primary) py-4 text-sm font-semibold text-(--tip-secondary) transition hover:bg-(--tip-primary)/10"
        >
          <span>{t("sharePublicly")}</span>
          <ExternalLink className="size-4" strokeWidth={2} />
        </motion.a>
      ) : null}

      <motion.button
        variants={itemVariants}
        type="button"
        onClick={onRestart}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-(--tip-primary) py-4 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
      >
        <RotateCw className="size-4" strokeWidth={2} />
        <span>{t("makeAnotherTip")}</span>
      </motion.button>

      {SHOW_REFUND_REQUEST ? (
        <motion.div variants={itemVariants} className="mt-auto pt-6">
          <RefundRequest tipId={tipId} amount={amount} currency={currency} />
        </motion.div>
      ) : null}
    </motion.div>
  );
};
