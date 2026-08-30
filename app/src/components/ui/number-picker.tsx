"use client";

import {
  type FC,
  type KeyboardEvent,
  useEffect,
  useId,
  useState,
} from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  invalid?: boolean;
  suffix?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
  size?: "sm" | "default";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, step: number): number {
  const precision = String(step).includes(".")
    ? (String(step).split(".")[1]?.length ?? 0)
    : 0;
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(precision));
}

export const NumberPicker: FC<NumberPickerProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  invalid = false,
  suffix,
  id: idProp,
  "aria-label": ariaLabel,
  className,
  size = "default",
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (next: number) => {
    const clamped = clamp(roundToStep(next, step), min, max);
    onChange(clamped);
    setDraft(String(clamped));
  };

  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    commit((Number.isFinite(value) ? value : min) + direction * step);
  };

  const handleBlur = () => {
    const parsed = Number.parseFloat(draft);
    if (!Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }
    commit(parsed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      nudge(1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      nudge(-1);
      return;
    }
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const isSm = size === "sm";
  const valueChars = Math.max(draft.length, String(Math.trunc(max)).length, 1);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-white shadow-xs transition",
        isSm
          ? "h-(--control-height-sm)"
          : "h-(--control-height-default)",
        invalid
          ? "border-destructive ring-3 ring-destructive/20"
          : "border-zinc-200/80 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || atMin}
        aria-label="Decrease"
        onClick={() => nudge(-1)}
        className="flex aspect-square h-full shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-50 hover:text-ink-charcoal disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus
          className={isSm ? "size-3.5" : "size-4"}
          strokeWidth={1.75}
        />
      </button>

      <div className="flex flex-1 items-center justify-center">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          role="spinbutton"
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            if (next === "" || /^-?\d*\.?\d*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="border-0 bg-transparent p-0 text-center text-sm font-semibold text-ink-charcoal tabular-nums outline-none"
          style={{ width: `${valueChars}ch` }}
        />
        {suffix ? (
          <span
            className={cn(
              "shrink-0 font-medium text-zinc-400",
              isSm ? "text-xs" : "text-sm",
            )}
          >
            {suffix}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || atMax}
        aria-label="Increase"
        onClick={() => nudge(1)}
        className="flex aspect-square h-full shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-50 hover:text-ink-charcoal disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus
          className={isSm ? "size-3.5" : "size-4"}
          strokeWidth={1.75}
        />
      </button>
    </div>
  );
};
