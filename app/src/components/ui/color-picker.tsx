"use client";

import { type FC, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
};

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return null;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "#000000",
  id,
  disabled = false,
  className,
  error,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const swatchId = `${inputId}-swatch`;
  const errorId = `${inputId}-error`;
  const nativeValue = normalizeHex(value) ?? "#000000";

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-2">
        <label
          htmlFor={swatchId}
          className={cn(
            "relative size-9 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-xs transition-shadow",
            "focus-within:ring-2 focus-within:ring-electric-lime focus-within:ring-offset-2",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-zinc-300",
            error && "border-red-300",
          )}
          style={{ backgroundColor: nativeValue }}
          aria-label={`${label} swatch`}
        >
          <input
            id={swatchId}
            type="color"
            value={nativeValue}
            disabled={disabled}
            aria-label={`${label} color picker`}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </label>
        <Input
          id={inputId}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-full font-mono text-sm"
        />
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};
