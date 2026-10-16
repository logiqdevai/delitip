"use client";

import { type DragEvent, type FC, useId, useRef, useState } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// Document counterpart of ImagePicker: picks a single file (PDF or image),
// shows its name and size, and enforces type/size limits inline. It does
// not upload — the owner decides when (usually on form submit).
export type FilePickerProps = {
  label?: string;
  hint?: string | null;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: readonly string[];
  maxSizeBytes?: number;
  disabled?: boolean;
  isPending?: boolean;
  id?: string;
  className?: string;
  error?: string;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const describeAccept = (accept: readonly string[]) =>
  accept
    .map((type) =>
      type === "application/pdf"
        ? "PDF"
        : type.startsWith("image/")
          ? type.replace("image/", "").toUpperCase().replace("JPEG", "JPG")
          : type,
    )
    .join(", ");

export const FilePicker: FC<FilePickerProps> = ({
  label = "File",
  hint,
  value,
  onChange,
  accept = ["application/pdf", "image/jpeg", "image/png"],
  maxSizeBytes,
  disabled = false,
  isPending = false,
  id,
  className,
  error,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const isDisabled = disabled || isPending;
  const resolvedHint =
    hint === null
      ? null
      : (hint ??
        `${describeAccept(accept)}${maxSizeBytes ? ` · up to ${formatBytes(maxSizeBytes)}` : ""}`);
  const shownError = error ?? localError;

  const openFileDialog = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const applyFile = (file: File | undefined) => {
    if (!file) return;
    if (!accept.includes(file.type)) {
      setLocalError(`Please choose a ${describeAccept(accept)} file.`);
      return;
    }
    if (maxSizeBytes && file.size > maxSizeBytes) {
      setLocalError(`The file must be ${formatBytes(maxSizeBytes)} or smaller.`);
      return;
    }
    setLocalError(null);
    onChange(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    applyFile(event.dataTransfer.files?.[0]);
  };

  const isImage = value?.type.startsWith("image/") ?? false;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={inputId} className="w-fit">
          {label}
        </Label>
        {resolvedHint ? (
          <p className="text-xs text-zinc-500">{resolvedHint}</p>
        ) : null}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group/dropzone relative flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3 transition-all",
          value
            ? "border-solid border-zinc-200/80 bg-white shadow-xs"
            : "border-zinc-200 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-50",
          isDragging &&
            "border-solid border-brand-700 bg-brand-50 shadow-[0_0_0_4px] shadow-brand-100",
          shownError && "border-red-300 bg-red-50/40",
          isDisabled && "opacity-60",
        )}
      >
        <button
          type="button"
          disabled={isDisabled}
          onClick={openFileDialog}
          aria-label={value ? "Replace file" : "Choose file"}
          className={cn(
            "relative flex size-12 shrink-0 items-center justify-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-electric-lime focus-visible:ring-offset-2",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
            value
              ? "bg-brand-50 text-brand-800"
              : "bg-white text-zinc-400 shadow-xs ring-1 ring-zinc-200/70 group-hover/dropzone:text-zinc-500",
            isDragging && "bg-brand-100 text-brand-800",
          )}
        >
          {isImage ? (
            <ImageIcon className="size-5" strokeWidth={2} />
          ) : (
            <FileText className="size-5" strokeWidth={2} />
          )}
          {isPending ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75 backdrop-blur-[1px]">
              <Spinner className="size-5 text-ink-charcoal" />
            </span>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-semibold text-ink-charcoal">
                {value.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {formatBytes(value.size)}
                {isPending ? " · Uploading…" : ""}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink-charcoal">
                {isDragging ? "Drop to add" : "Add your invoice"}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {isDragging ? "Release to add this file" : "Drop a file here, or browse"}
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDisabled}
            className={cn(
              "h-8 rounded-full bg-white px-3.5 text-xs font-semibold text-ink-charcoal shadow-xs ring-1 ring-zinc-200/80 hover:bg-zinc-50",
              value && "bg-zinc-100 ring-0 hover:bg-zinc-200",
            )}
            onClick={openFileDialog}
          >
            <Upload data-icon="inline-start" />
            {value ? "Replace" : "Browse"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDisabled}
              aria-label="Remove file"
              className="size-8 rounded-full px-0 text-zinc-600 hover:bg-zinc-100 hover:text-red-700"
              onClick={() => {
                setLocalError(null);
                onChange(null);
              }}
            >
              <X className="size-3.5" />
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept.join(",")}
          className="sr-only"
          disabled={isDisabled}
          onChange={(event) => {
            applyFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {shownError ? <p className="text-xs text-red-600">{shownError}</p> : null}
    </div>
  );
};
