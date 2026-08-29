"use client";

import { type FC, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Coffee,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";
import {
  clientComplimentOptions,
  clientEmployee,
  clientTipPresets,
  type ClientComplimentTag,
} from "../data/client-demo";

const ClientFlowSteps = {
  TIP: "tip",
  FEEDBACK: "feedback",
  SUCCESS: "success",
} as const;

type ClientFlowStep =
  (typeof ClientFlowSteps)[keyof typeof ClientFlowSteps];

const complimentIcons = {
  "super-fast": Zap,
  "friendly-vibe": Sparkles,
  "great-recommendation": Coffee,
  attentive: Star,
} as const;

function formatTip(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export const ClientCustomerFlow: FC = () => {
  const [step, setStep] = useState<ClientFlowStep>(ClientFlowSteps.TIP);
  const [selectedPreset, setSelectedPreset] = useState<number>(5);
  const [customTip, setCustomTip] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<ClientComplimentTag[]>([
    "super-fast",
    "friendly-vibe",
  ]);
  const [note, setNote] = useState("");

  const tipAmount = useMemo(() => {
    const parsed = Number.parseFloat(customTip);
    if (customTip && Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return selectedPreset;
  }, [customTip, selectedPreset]);

  const toggleTag = (tag: ClientComplimentTag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  };

  const resetFlow = () => {
    setStep(ClientFlowSteps.TIP);
    setSelectedPreset(5);
    setCustomTip("");
    setRating(5);
    setSelectedTags(["super-fast", "friendly-vibe"]);
    setNote("");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-paper-offwhite to-paper-offwhite p-4 sm:p-8">
      <div className="relative flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[40px] border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-300">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <BrandMark
              size="sm"
              className="size-6 rounded-md text-xs"
            />
            <span className="text-sm font-bold tracking-tight text-ink-charcoal">
              delitip
              <span className="text-electric-lime">.com</span>
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-neutral-fill px-2.5 py-1 text-[11px] font-medium text-zinc-400">
            <span className="size-1.5 rounded-full bg-electric-lime" />
            {clientEmployee.table}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          {step === ClientFlowSteps.TIP ? (
            <div className="auth-fade-enter space-y-6">
              <div className="pt-2 text-center">
                <div className="relative inline-block">
                  <Image
                    src={clientEmployee.photo}
                    alt={clientEmployee.name}
                    width={80}
                    height={80}
                    className="mx-auto size-20 rounded-full object-cover ring-4 ring-brand-50"
                  />
                  <div className="absolute right-0 bottom-0 rounded-full bg-electric-lime p-1 text-ink-charcoal shadow-sm">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </div>
                </div>
                <h1 className="mt-3 text-lg font-bold text-ink-charcoal">
                  Thank {clientEmployee.name}
                </h1>
                <p className="text-xs text-zinc-500">
                  {clientEmployee.venue} • {clientEmployee.role}
                </p>
              </div>

              <div>
                <label className="mb-3 block text-center text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  Choose your tip
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {clientTipPresets.map((preset) => {
                    const active =
                      !customTip && selectedPreset === preset.amount;

                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(preset.amount);
                          setCustomTip("");
                        }}
                        className={cn(
                          "rounded-2xl p-3 text-center transition",
                          active
                            ? "border-2 border-electric-lime bg-brand-50/60"
                            : "border border-zinc-200 bg-white hover:border-electric-lime hover:bg-brand-50/50"
                        )}
                      >
                        <div
                          className={cn(
                            "text-sm font-bold",
                            active
                              ? "text-brand-700"
                              : "text-ink-charcoal group-hover:text-brand-700"
                          )}
                        >
                          {formatTip(preset.amount)}
                        </div>
                        <div
                          className={cn(
                            "mt-0.5 text-[11px]",
                            "featured" in preset && preset.featured
                              ? "font-medium text-electric-lime"
                              : "text-zinc-400"
                          )}
                        >
                          {preset.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative mt-3">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customTip}
                    onChange={(event) => setCustomTip(event.target.value)}
                    placeholder="Enter custom tip"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-8 text-sm focus:border-brand-500 focus:ring-2 focus:ring-electric-lime focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-[11px] text-zinc-600">
                <ShieldCheck
                  className="size-4 shrink-0 text-electric-lime"
                  strokeWidth={2}
                />
                <span>
                  100% transparent. Tips are securely distributed directly to{" "}
                  {clientEmployee.name} & staff.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep(ClientFlowSteps.FEEDBACK)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-lime py-3.5 text-sm font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700"
              >
                <span>Continue to Pay {formatTip(tipAmount)}</span>
                <ArrowRight className="size-4" strokeWidth={2} />
              </button>
            </div>
          ) : null}

          {step === ClientFlowSteps.FEEDBACK ? (
            <div className="auth-fade-enter space-y-5">
              <div className="pt-2 text-center">
                <h2 className="text-lg font-bold text-ink-charcoal">
                  How was your experience?
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Leave {clientEmployee.name} a quick compliment
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const filled = value <= rating;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="transition hover:scale-110"
                      aria-label={`Rate ${value} stars`}
                    >
                      <Star
                        className={cn(
                          "size-8",
                          filled
                            ? "fill-rating-amber text-rating-amber"
                            : "text-zinc-300"
                        )}
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {clientComplimentOptions.map((tag) => {
                  const active = selectedTags.includes(tag.id);
                  const Icon = complimentIcons[tag.id];

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
                        active
                          ? "border border-brand-200 bg-brand-50 text-brand-800"
                          : "bg-neutral-fill text-zinc-700 hover:bg-zinc-200"
                      )}
                    >
                      <Icon className="size-3" strokeWidth={2} />
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={`Write a short message for ${clientEmployee.name} (optional)...`}
                className="w-full resize-none rounded-xl border border-zinc-200 p-3 text-xs focus:ring-2 focus:ring-electric-lime focus:outline-none"
              />

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(ClientFlowSteps.SUCCESS)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-charcoal py-3 text-sm font-medium text-paper-offwhite shadow transition hover:bg-zinc-800"
                >
                  <svg
                    className="size-4 fill-current"
                    viewBox="0 0 170 170"
                    aria-hidden
                  >
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.43-5.63-8.58-10.03-18.01-13.2-28.29-3.17-10.28-4.76-20.08-4.76-29.41 0-12.98 3.37-23.77 10.11-32.37 6.74-8.6 15.18-13.02 25.32-13.26 4.89 0 10.11 1.25 15.65 3.76 5.54 2.5 9.28 3.82 11.22 3.94 1.52-.12 5.48-1.5 11.87-4.13 6.39-2.63 11.81-3.72 16.27-3.26 12 .98 21.36 5.54 28.09 13.68-10.66 6.42-15.88 15.34-15.66 26.76.22 8.92 3.69 16.32 10.42 22.2 6.73 5.88 14.65 9.24 23.77 10.09-2.07 6.31-4.79 12.63-8.17 18.96zM119.22 31.81c0-7.39 2.67-14.24 8.01-20.55 5.34-6.31 11.96-10.37 19.86-12.18.22 1.3.33 2.4.33 3.29 0 7.39-2.82 14.46-8.47 21.2-5.65 6.74-12.4 10.66-20.25 11.75-.44-1.2-.66-2.37-.66-3.51z" />
                  </svg>
                  <span>Pay with Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(ClientFlowSteps.SUCCESS)}
                  className="w-full rounded-2xl bg-neutral-fill py-2.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-200"
                >
                  Pay with Card or Google Pay
                </button>
              </div>
            </div>
          ) : null}

          {step === ClientFlowSteps.SUCCESS ? (
            <div className="auth-fade-enter space-y-5 py-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 shadow-inner">
                <Check className="size-8" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-charcoal">
                  Thank you!
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Your {formatTip(tipAmount)} tip and compliments were sent to{" "}
                  {clientEmployee.name}.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left">
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Receipt ID</span>
                  <span className="font-mono text-ink-charcoal">
                    {clientEmployee.receiptId}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Business</span>
                  <span className="font-medium text-ink-charcoal">
                    {clientEmployee.venue}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Employee</span>
                  <span className="font-medium text-ink-charcoal">
                    {clientEmployee.fullName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={resetFlow}
                className="mx-auto block pt-4 text-xs font-semibold text-brand-700 hover:underline"
              >
                Make another tip
              </button>
            </div>
          ) : null}

          <div className="border-t border-zinc-100 pt-4 text-center">
            <p className="text-[11px] font-medium text-zinc-400">
              Powered by{" "}
              <strong className="font-semibold text-zinc-700">
                delitip.com
              </strong>{" "}
              • Transparent & Secure
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
