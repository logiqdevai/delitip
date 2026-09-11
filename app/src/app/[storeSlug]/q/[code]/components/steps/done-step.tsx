"use client";

import { type FC, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { AlertTriangle, Check, CheckCircle2, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreatePublicRefundRequest } from "@/features/refunds/hooks/use-refunds";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
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
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.4 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.4 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};

interface DoneStepProps {
  review: CreatePublicReviewResponse | null;
  tipId: string;
  amount?: number;
  currency?: Currency;
  storeName?: string;
  recipientLabel?: string;
  thankYouMessage?: string;
  onRestart: () => void;
}

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
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--tip-secondary)" strokeWidth={2} />
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
  recipientLabel,
  thankYouMessage,
  onRestart,
}) => {
  const t = useTranslations("doneStep");
  const receiptCode = `#${tipId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const hasTipDetails = amount !== undefined && currency !== undefined;
  const description =
    thankYouMessage?.trim() ||
    (hasTipDetails
      ? t(review ? "descriptionWithReview" : "descriptionWithoutReview", {
          amount: formatMoney(amount, currency),
          recipient: recipientLabel ?? "",
        })
      : t("descriptionNoDetails"));

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const styles = rootRef.current ? getComputedStyle(rootRef.current) : null;
    const primary = styles?.getPropertyValue("--tip-primary").trim();
    const secondary = styles?.getPropertyValue("--tip-secondary").trim();
    const colors = [primary || "#C8F169", secondary || "#9FBF3E", "#FFD166", "#FFFFFF"];

    const timer = window.setTimeout(() => celebrate(colors), 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={rootRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-1 flex-col gap-5 px-4 py-8 text-center"
    >
      <div className="relative mx-auto flex size-16 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-(--tip-primary)/40"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2, repeat: 1 }}
        />
        <motion.div
          className="relative flex size-16 items-center justify-center rounded-full bg-(--tip-primary)/15 text-(--tip-secondary) shadow-inner"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h1 className="text-xl font-bold text-ink-charcoal">{t("heading")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left"
      >
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
          <span className="shrink-0">{t("receiptIdLabel")}</span>
          <span className="min-w-0 truncate font-mono text-ink-charcoal">
            {receiptCode}
          </span>
        </div>
        {storeName ? (
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
            <span className="shrink-0">{t("businessLabel")}</span>
            <span className="min-w-0 truncate font-medium text-ink-charcoal">
              {storeName}
            </span>
          </div>
        ) : null}
        {recipientLabel ? (
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
            <span className="shrink-0">{t("recipientLabel")}</span>
            <span className="min-w-0 truncate font-medium text-ink-charcoal">
              {recipientLabel}
            </span>
          </div>
        ) : null}
      </motion.div>

      {review?.redirect.should_redirect && review.redirect.url ? (
        <motion.a
          variants={itemVariants}
          href={review.redirect.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--tip-primary) py-3.5 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
        >
          <span>{t("sharePublicly")}</span>
          <ExternalLink className="size-4" strokeWidth={2} />
        </motion.a>
      ) : null}

      <motion.button
        variants={itemVariants}
        type="button"
        onClick={onRestart}
        className="mx-auto block pt-2 text-xs font-semibold text-(--tip-secondary) hover:underline"
      >
        {t("makeAnotherTip")}
      </motion.button>

      <motion.div variants={itemVariants} className="mt-auto pt-6">
        <RefundRequest tipId={tipId} amount={amount} currency={currency} />
      </motion.div>
    </motion.div>
  );
};
