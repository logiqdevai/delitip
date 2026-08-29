"use client";

import { type FC, useMemo, useState } from "react";
import { ArrowRight, Check, MapPin, Users } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import type {
  PublicQrCode,
  PublicQrCodeEmployee,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { PublicStore } from "@/features/stores/interfaces/stores.interfaces";
import type { CreatePublicTipResponse } from "@/features/tips/interfaces/tips.interfaces";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import { cn } from "@/lib/utils";
import { AmountStep } from "@/app/[storeSlug]/q/[code]/components/steps/amount-step";
import { PaymentStep } from "@/app/[storeSlug]/q/[code]/components/steps/payment-step";
import { ThankYouStep } from "@/app/[storeSlug]/q/[code]/components/steps/thank-you-step";
import { ReviewStep } from "@/app/[storeSlug]/q/[code]/components/steps/review-step";
import { DoneStep } from "@/app/[storeSlug]/q/[code]/components/steps/done-step";

interface TipFlowProps {
  storeSlug: string;
  store: PublicStore;
  qr: PublicQrCode;
}

type FlowStep = "select" | "amount" | "payment" | "thank-you" | "review" | "done";

const employeeInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

const formatStoreAddress = (parts: {
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
}) => {
  return [parts.address_line, parts.city, parts.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
};

const EmployeeRow: FC<{
  employee: PublicQrCodeEmployee;
  selectable: boolean;
  selected: boolean;
  onToggle: () => void;
}> = ({ employee, selectable, selected, onToggle }) => {
  const content = (
    <>
      {employee.photo_url ? (
        <img
          src={employee.photo_url}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink-charcoal text-sm font-bold text-paper-offwhite">
          {employeeInitials(employee.full_name)}
        </div>
      )}
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-bold text-ink-charcoal">
          {employee.full_name}
        </p>
        <p className="truncate text-xs text-zinc-500">
          {employee.position?.trim() || "Team member"}
        </p>
      </div>
      {selectable ? (
        <div
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
            selected
              ? "border-electric-lime bg-electric-lime text-ink-charcoal"
              : "border-zinc-300 bg-white",
          )}
        >
          {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </div>
      ) : null}
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-xs transition",
    selectable
      ? selected
        ? "border-2 border-electric-lime bg-brand-50/60"
        : "border-zinc-200/80 bg-white hover:border-electric-lime/60"
      : "border-zinc-200/80 bg-white",
  );

  if (!selectable) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <button type="button" onClick={onToggle} className={rowClass}>
      {content}
    </button>
  );
};

export const TipFlow: FC<TipFlowProps> = ({ store, qr }) => {
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

  const [step, setStep] = useState<FlowStep>("select");
  const [selectedEmployeeIds, setSelectedEmployeeIds] =
    useState<string[]>(initialSelectedIds);
  const [amount, setAmount] = useState(0);
  const [tipResult, setTipResult] = useState<CreatePublicTipResponse | null>(
    null,
  );
  const [reviewResult, setReviewResult] =
    useState<CreatePublicReviewResponse | null>(null);

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

  const canContinueFromSelect = interactive
    ? selectedEmployeeIds.length > 0
    : true;

  const recipientLabel =
    employees.length === 0
      ? store.name
      : selectedEmployeeIds.length === 0
        ? "the team"
        : employees
            .filter((employee) => selectedEmployeeIds.includes(employee.id))
            .map((employee) => employee.full_name)
            .join(" & ");

  const accent = store.primary_color?.trim() || qr.store.primary_color?.trim();
  const logoUrl = store.logo_url ?? qr.store.logo_url;
  const address = formatStoreAddress(store);
  const welcome =
    store.welcome_message?.trim() ||
    `Welcome to ${store.name}. Leave a tip for great service.`;

  const resetFlow = () => {
    setStep("select");
    setSelectedEmployeeIds(initialSelectedIds);
    setAmount(0);
    setTipResult(null);
    setReviewResult(null);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper-offwhite">
      <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <BrandMark size="sm" className="size-8 shrink-0 rounded-lg text-xs" />
          <span className="truncate text-sm font-bold tracking-tight text-ink-charcoal">
            delitip
            <span className="text-zinc-400">.com</span>
          </span>
        </div>
        {qr.spots[0] ? (
          <span className="shrink-0 rounded-full bg-neutral-fill px-2.5 py-1 text-[11px] font-medium text-zinc-500">
            {qr.spots[0].name}
          </span>
        ) : null}
      </header>

      {step === "select" ? (
        <div className="flex flex-1 flex-col gap-8 px-5 py-8">
          <section className="flex flex-col items-center text-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="size-20 rounded-2xl object-cover shadow-sm ring-4 ring-white"
                style={accent ? { boxShadow: `0 0 0 4px ${accent}33` } : undefined}
              />
            ) : (
              <div
                className={cn(
                  "flex size-20 items-center justify-center rounded-2xl text-2xl font-bold text-ink-charcoal shadow-sm",
                  !accent && "bg-electric-lime",
                )}
                style={accent ? { backgroundColor: accent } : undefined}
              >
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}

            <h1 className="mt-4 text-xl font-bold tracking-tight text-ink-charcoal">
              {store.name}
            </h1>

            {address ? (
              <p className="mt-1.5 flex items-start justify-center gap-1 text-xs text-zinc-500">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{address}</span>
              </p>
            ) : null}

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
              {welcome}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              <Users className="size-3.5" />
              {employees.length === 0
                ? "Tip the store"
                : employees.length === 1
                  ? "Your host"
                  : mode === "CHOOSE_MANY"
                    ? "Select who to thank"
                    : mode === "CHOOSE_ONE"
                      ? "Choose who to thank"
                      : "The team"}
            </div>

            {employees.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
                Your tip goes to {store.name}.
              </div>
            ) : (
              <ul className="space-y-2">
                {employees.map((employee) => (
                  <li key={employee.id}>
                    <EmployeeRow
                      employee={employee}
                      selectable={interactive}
                      selected={selectedEmployeeIds.includes(employee.id)}
                      onToggle={() => toggleEmployee(employee.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            type="button"
            disabled={!canContinueFromSelect}
            onClick={() => setStep("amount")}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-lime py-3.5 text-sm font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Continue</span>
            <ArrowRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      {step === "amount" ? (
        <AmountStep
          currency={store.currency}
          suggestedAmounts={store.suggested_tip_amounts}
          allowCustomAmount={store.allow_custom_tip_amount}
          recipientLabel={recipientLabel}
          onContinue={(value) => {
            setAmount(value);
            setStep("payment");
          }}
        />
      ) : null}

      {step === "payment" ? (
        <PaymentStep
          qrCodeId={qr.qr_code.id}
          amount={amount}
          currency={store.currency}
          storeName={store.name}
          recipientLabel={recipientLabel}
          selectionMode={mode}
          selectedEmployeeIds={selectedEmployeeIds}
          onBack={() => setStep("amount")}
          onSuccess={(result) => {
            setTipResult(result);
            setStep("thank-you");
          }}
        />
      ) : null}

      {step === "thank-you" && tipResult ? (
        <ThankYouStep
          amount={tipResult.tip.amount}
          currency={tipResult.tip.currency}
          recipientLabel={recipientLabel}
          message={tipResult.thank_you_message}
          onLeaveReview={() => setStep("review")}
          onDone={() => setStep("done")}
        />
      ) : null}

      {step === "review" && tipResult ? (
        <ReviewStep
          storeId={store.id}
          tipId={tipResult.tip.id}
          employeeId={
            selectedEmployeeIds.length === 1 ? selectedEmployeeIds[0] : undefined
          }
          recipientLabel={recipientLabel}
          onSkip={() => setStep("done")}
          onSubmitted={(result) => {
            setReviewResult(result);
            setStep("done");
          }}
        />
      ) : null}

      {step === "done" ? (
        <DoneStep review={reviewResult} onRestart={resetFlow} />
      ) : null}

      <footer className="border-t border-zinc-100 px-5 py-4 text-center text-[11px] text-zinc-400">
        Powered by delitip
      </footer>
    </main>
  );
};
