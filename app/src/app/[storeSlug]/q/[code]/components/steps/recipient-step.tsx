"use client";

import { type FC } from "react";
import { ArrowLeft, ArrowRight, Check, Users } from "lucide-react";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import type {
  PublicQrCodeEmployee,
  QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { cn } from "@/lib/utils";

const EmployeeRow: FC<{
  employee: PublicQrCodeEmployee;
  selectable: boolean;
  selected: boolean;
  onToggle: () => void;
}> = ({ employee, selectable, selected, onToggle }) => {
  const content = (
    <>
      <EmployeeAvatar
        name={employee.full_name}
        photoUrl={employee.photo_url}
        size="xl"
        fallback="icon"
      />
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
    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-xs transition",
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
  employees,
  mode,
  interactive,
  selectedEmployeeIds,
  onToggle,
  onBack,
  onContinue,
}) => {
  const canContinue = interactive ? selectedEmployeeIds.length > 0 : true;

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
        <Users className="size-3.5 shrink-0" />
        <span className="truncate">
          {employees.length === 0
            ? "Tip the store"
            : employees.length === 1
              ? "Your host"
              : mode === "CHOOSE_MANY"
                ? "Select who to thank"
                : mode === "CHOOSE_ONE"
                  ? "Choose who to thank"
                  : "The team"}
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
          Your tip goes to {storeName}.
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
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--tip-primary) py-3.5 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Continue</span>
          <ArrowRight className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};
