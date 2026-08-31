"use client";

import { type DragEvent, type FC, useEffect, useId, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const imagePickerPreviewVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden border transition-colors",
  {
    variants: {
      mode: {
        logo: "size-14 rounded-xl",
        cover: "h-14 w-24 rounded-xl",
        image: "size-14 rounded-xl",
      },
    },
    defaultVariants: {
      mode: "image",
    },
  },
);

const IMAGE_PICKER_MODE_LABELS = {
  logo: "Logo",
  cover: "Cover image",
  image: "Image",
} as const;

const IMAGE_PICKER_MODE_HINTS = {
  logo: "Square PNG or SVG",
  cover: "Wide image recommended",
  image: "PNG or JPG",
} as const;

const IMAGE_PICKER_MODE_ACTIONS = {
  logo: {
    emptyTitle: "Add your logo",
    emptyBody: "Drop a file here, or browse",
    filledTitle: "Logo ready",
  },
  cover: {
    emptyTitle: "Add a cover image",
    emptyBody: "Drop a file here, or browse",
    filledTitle: "Cover ready",
  },
  image: {
    emptyTitle: "Add a photo",
    emptyBody: "Drop a file here, or browse",
    filledTitle: "Photo ready",
  },
} as const;

export type ImagePickerMode = NonNullable<
  VariantProps<typeof imagePickerPreviewVariants>["mode"]
>;

export type ImagePickerProps = {
  mode?: ImagePickerMode;
  label?: string;
  hint?: string | null;
  value?: string | null;
  onChange: (file: File) => void;
  onClear?: () => void;
  disabled?: boolean;
  isPending?: boolean;
  accept?: string;
  id?: string;
  className?: string;
  error?: string;
  alt?: string;
};

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export const ImagePicker: FC<ImagePickerProps> = ({
  mode = "image",
  label,
  hint,
  value,
  onChange,
  onClear,
  disabled = false,
  isPending = false,
  accept = "image/*",
  id,
  className,
  error,
  alt = "",
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const wasPendingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const resolvedLabel = label ?? IMAGE_PICKER_MODE_LABELS[mode];
  const resolvedHint =
    hint === null ? null : (hint ?? IMAGE_PICKER_MODE_HINTS[mode]);
  const copy = IMAGE_PICKER_MODE_ACTIONS[mode];
  const isDisabled = disabled || isPending;
  const hasValue = Boolean(value);

  useEffect(() => {
    if (isPending) {
      wasPendingRef.current = true;
      setShowSuccess(false);
      return;
    }

    if (wasPendingRef.current && hasValue) {
      setShowSuccess(true);
      wasPendingRef.current = false;
    }
  }, [isPending, hasValue]);

  useEffect(() => {
    if (!hasValue) {
      setShowSuccess(false);
    }
  }, [hasValue]);

  const openFileDialog = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const applyFile = (file: File | undefined) => {
    if (!file || !isImageFile(file)) return;
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

  return (
    <div className={cn("@container flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-0.5">
        <Label id={labelId} htmlFor={inputId} className="w-fit">
          {resolvedLabel}
        </Label>
        {resolvedHint ? (
          <p id={hintId} className="text-xs text-zinc-500">
            {resolvedHint}
          </p>
        ) : null}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group/dropzone relative flex flex-col gap-3 rounded-2xl border border-dashed p-3 transition-all",
          "@sm:flex-row @sm:items-center @sm:gap-3.5 @sm:p-3.5",
          hasValue
            ? showSuccess
              ? "border-solid border-brand-200 bg-brand-50/40 shadow-xs"
              : "border-solid border-zinc-200/80 bg-white shadow-xs"
            : "border-zinc-200 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-50",
          isDragging &&
            "border-solid border-brand-700 bg-brand-50 shadow-[0_0_0_4px] shadow-brand-100",
          error && "border-red-300 bg-red-50/40",
          isDisabled && "opacity-60",
        )}
      >
        <div className="flex items-center gap-3 @sm:contents">
          <button
            type="button"
            disabled={isDisabled}
            aria-labelledby={labelId}
            aria-describedby={
              [resolvedHint ? hintId : null, error ? errorId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-invalid={error ? true : undefined}
            onClick={openFileDialog}
            className={cn(
              imagePickerPreviewVariants({ mode }),
              "outline-none focus-visible:ring-2 focus-visible:ring-electric-lime focus-visible:ring-offset-2",
              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
              hasValue
                ? "border-zinc-200 bg-white"
                : "border-transparent bg-white text-zinc-400 shadow-xs ring-1 ring-zinc-200/70 group-hover/dropzone:text-zinc-500",
              isDragging && "bg-brand-50 text-brand-800 ring-brand-200",
            )}
          >
            {hasValue ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value!}
                alt={alt}
                className={cn(
                  "size-full",
                  mode === "logo" ? "object-contain p-1.5" : "object-cover",
                )}
              />
            ) : (
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors",
                  "group-hover/dropzone:bg-brand-50 group-hover/dropzone:text-brand-800",
                  isDragging && "bg-brand-100 text-brand-800",
                )}
              >
                <ImagePlus className="size-3.5" strokeWidth={2} />
              </span>
            )}

            {isPending ? (
              <span className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
                <Spinner className="size-5 text-ink-charcoal" />
              </span>
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            {hasValue ? (
              <>
                <p className="truncate text-sm font-semibold text-ink-charcoal">
                  {copy.filledTitle}
                </p>
                {showSuccess ? (
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-brand-700">
                    <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
                    Upload successful
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Tap to replace, or use an action below
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink-charcoal">
                  {isDragging ? "Drop to upload" : copy.emptyTitle}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {isDragging ? "Release to add this file" : copy.emptyBody}
                </p>
              </>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex w-full flex-col gap-1.5 @sm:w-auto @sm:flex-row @sm:flex-wrap @sm:items-center",
            !hasValue && "@sm:mt-0",
          )}
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDisabled}
            className={cn(
              "h-9 w-full rounded-xl bg-white px-3.5 text-xs font-semibold text-ink-charcoal shadow-xs ring-1 ring-zinc-200/80 hover:bg-zinc-50",
              "@sm:h-8 @sm:w-auto @sm:rounded-full",
              hasValue &&
                "bg-zinc-100 ring-0 hover:bg-zinc-200 @sm:bg-zinc-100",
            )}
            onClick={openFileDialog}
          >
            <Upload data-icon="inline-start" />
            {isPending ? "Uploading…" : hasValue ? "Replace" : "Browse"}
          </Button>
          {hasValue && onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDisabled}
              className="h-9 w-full rounded-xl px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-red-700 @sm:h-8 @sm:w-auto @sm:rounded-full"
              onClick={onClear}
            >
              <X data-icon="inline-start" />
              Remove
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={isDisabled}
          onChange={(event) => {
            applyFile(event.target.files?.[0]);
            event.target.value = "";
          }}
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
