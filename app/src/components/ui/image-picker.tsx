"use client";

import { type DragEvent, type FC, useId, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const imagePickerPreviewVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric-lime focus-visible:ring-offset-2",
  {
    variants: {
      mode: {
        logo: "size-20 rounded-2xl",
        cover: "h-20 w-[7.5rem] rounded-2xl",
        image: "size-20 rounded-2xl",
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
  const [isDragging, setIsDragging] = useState(false);
  const resolvedLabel = label ?? IMAGE_PICKER_MODE_LABELS[mode];
  const resolvedHint =
    hint === null ? null : (hint ?? IMAGE_PICKER_MODE_HINTS[mode]);
  const isDisabled = disabled || isPending;
  const hasValue = Boolean(value);

  const openFileDialog = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const applyFile = (file: File | undefined) => {
    if (!file || !isImageFile(file)) return;
    onChange(file);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    applyFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-0.5">
        <Label id={labelId} htmlFor={inputId}>
          {resolvedLabel}
        </Label>
        {resolvedHint ? (
          <p id={hintId} className="text-xs text-zinc-500">
            {resolvedHint}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            imagePickerPreviewVariants({ mode }),
            "group/preview cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
            hasValue
              ? "border-solid border-zinc-200 bg-white"
              : "border-zinc-200 bg-zinc-50 text-zinc-300 hover:border-zinc-300 hover:bg-zinc-100/80 hover:text-zinc-400",
            isDragging &&
              "border-solid border-brand-700 bg-brand-50 text-brand-800",
            error && "border-red-300",
          )}
        >
          {hasValue ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value!}
              alt={alt}
              className={cn(
                "size-full transition-opacity group-hover/preview:opacity-80",
                mode === "logo" ? "object-contain p-1.5" : "object-cover",
              )}
            />
          ) : (
            <ImagePlus className="size-5" strokeWidth={1.75} />
          )}

          {isPending ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <Spinner className="size-5 text-ink-charcoal" />
            </span>
          ) : null}

          {!isPending && hasValue ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-charcoal/0 opacity-0 transition-all group-hover/preview:bg-ink-charcoal/35 group-hover/preview:opacity-100">
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-charcoal shadow-xs">
                Replace
              </span>
            </span>
          ) : null}
        </button>

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

        <div className="flex min-w-0 flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDisabled}
            className="h-8 w-fit rounded-full bg-zinc-100 px-4 text-xs font-semibold text-ink-charcoal hover:bg-zinc-200"
            onClick={openFileDialog}
          >
            {isPending ? "Uploading…" : hasValue ? "Replace" : "Upload"}
          </Button>
          {hasValue && onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDisabled}
              className="h-8 w-fit rounded-full px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-red-600"
              onClick={onClear}
            >
              <X data-icon="inline-start" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};
