"use client";

import { type FC, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import type {
  PublicQrCodeEmployee,
  QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import {
  StoreIndustries,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

// Flip to true to show the prev/next picker that cycles every industry illustration.
const SHOW_ILLUSTRATION_TESTER = false;

const EmployeeRow: FC<{
  employee: PublicQrCodeEmployee;
  selectable: boolean;
  selected: boolean;
  onToggle: () => void;
}> = ({ employee, selectable, selected, onToggle }) => {
  const t = useTranslations("recipientStep");
  const content = (
    <>
      <EmployeeAvatar
        name={employee.full_name}
        photoUrl={employee.photo_url}
        size="xl"
        fallback="initials"
      />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-serif text-base font-bold text-ink-charcoal">
          {employee.full_name}
        </p>
        <p className="truncate text-xs text-zinc-500">
          {employee.position?.trim() || t("teamMemberFallback")}
        </p>
      </div>
      {selectable ? (
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
            selected
              ? "border-(--tip-primary) bg-(--tip-primary) text-(--tip-primary-foreground)"
              : "border-zinc-300 bg-white",
          )}
        >
          {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </div>
      ) : null}
    </>
  );

  const rowClass = cn(
    "flex w-full items-center gap-4 rounded-2xl border px-4 py-4 shadow-xs transition",
    selectable
      ? selected
        ? "border-2 border-(--tip-primary) bg-(--tip-primary)/10"
        : "border-zinc-200/80 bg-white hover:border-(--tip-primary)/60"
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

interface RecipientStepProps {
  storeName: string;
  industry: StoreIndustry;
  employees: PublicQrCodeEmployee[];
  mode: QrCodeSelectionMode;
  interactive: boolean;
  selectedEmployeeIds: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const RecipientStep: FC<RecipientStepProps> = ({
  storeName,
  industry: storeIndustry,
  employees,
  mode,
  interactive,
  selectedEmployeeIds,
  onToggle,
  onBack,
  onContinue,
}) => {
  const t = useTranslations("recipientStep");
  // Illustration tester state (see SHOW_ILLUSTRATION_TESTER).
  const industries = Object.values(StoreIndustries);
  const [industryIndex, setIndustryIndex] = useState(
    Math.max(0, industries.indexOf(storeIndustry)),
  );
  const industry = industries[industryIndex];
  const illustrationUrl = `url(/brand/team/${industry.toLowerCase().replace(/_/g, "-")}.png)`;
  const copy =
    employees.length === 1
      ? {
          eyebrow: t("eyebrowYourHost"),
          heading: t("headingHost"),
          subtitle: t("subtitleHost"),
        }
      : mode === "CHOOSE_MANY"
        ? {
            eyebrow: t("eyebrowSelectMany"),
            heading: t("headingChooseMany"),
            subtitle: t("subtitleChooseMany"),
          }
        : mode === "CHOOSE_ONE"
          ? {
              eyebrow: t("eyebrowChooseOne"),
              heading: t("headingChooseOne"),
              subtitle: t("subtitleChooseOne"),
            }
          : {
              eyebrow: t("eyebrowTeam"),
              heading: t("headingTeam"),
              subtitle: t("subtitleTeam"),
            };
  const canContinue = interactive ? selectedEmployeeIds.length > 0 : true;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8">
      <div className="relative min-h-44">
        {employees.length > 0 ? (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-2 -right-4 aspect-square w-52 bg-(--tip-secondary) opacity-80 select-none"
            style={{
              maskImage: illustrationUrl,
              WebkitMaskImage: illustrationUrl,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        ) : null}
        <div className="relative max-w-[60%]">
          <div className="flex items-center gap-3 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
            <span className="h-px w-8 shrink-0 bg-(--tip-primary)" />
            <span className="truncate">
              {employees.length === 0 ? t("eyebrowTipStore") : copy.eyebrow}
            </span>
          </div>
          {employees.length > 0 ? (
            <>
              <h2 className="mt-4 font-serif text-3xl leading-tight font-bold text-ink-charcoal">
                {copy.heading}
              </h2>
              <p className="mt-3 text-sm text-zinc-500">{copy.subtitle}</p>
            </>
          ) : null}
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
          {t("tipGoesTo", { storeName })}
        </div>
      ) : (
        <ul className="space-y-2">
          {employees.map((employee) => (
            <li key={employee.id}>
              <EmployeeRow
                employee={employee}
                selectable={interactive}
                selected={selectedEmployeeIds.includes(employee.id)}
                onToggle={() => onToggle(employee.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto space-y-2">
        {SHOW_ILLUSTRATION_TESTER ? (
          <div className="flex items-center justify-between rounded-full border border-dashed border-zinc-300 px-2 py-1 text-xs text-zinc-600">
            <button
              type="button"
              className="rounded-full px-3 py-1 font-semibold transition hover:scale-[1.03] hover:bg-zinc-100"
              onClick={() =>
                setIndustryIndex(
                  (i) => (i - 1 + industries.length) % industries.length,
                )
              }
            >
              ← Prev
            </button>
            <span>
              {industry} ({industryIndex + 1}/{industries.length})
            </span>
            <button
              type="button"
              className="rounded-full px-3 py-1 font-semibold transition hover:scale-[1.03] hover:bg-zinc-100"
              onClick={() =>
                setIndustryIndex((i) => (i + 1) % industries.length)
              }
            >
              Next →
            </button>
          </div>
        ) : null}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-(--tip-primary) py-4 text-sm font-semibold text-(--tip-primary-foreground) transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{t("continue")}</span>
          <ArrowRight className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          <span>{t("back")}</span>
        </button>
      </div>
    </div>
  );
};
