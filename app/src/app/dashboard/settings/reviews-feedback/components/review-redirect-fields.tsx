"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

interface ReviewRedirectFieldsProps {
  threshold: number;
  onThresholdChange: (value: number) => void;
  redirectUrl: string;
  onRedirectUrlChange: (value: string) => void;
  urlError?: string;
}

export const ReviewRedirectFields: FC<ReviewRedirectFieldsProps> = ({
  threshold,
  onThresholdChange,
  redirectUrl,
  onRedirectUrlChange,
  urlError,
}) => {
  const t = useTranslations("dashboard.settings.reviews.redirect");

  return (
  <>
    <div>
      <label
        htmlFor="rating-threshold"
        className="mb-1 block text-xs font-semibold text-zinc-700"
      >
        {t("threshold")}
      </label>
      <Select
        items={RATING_OPTIONS.map((rating) => ({
          label: t("stars", { count: rating }),
          value: String(rating),
        }))}
        value={String(threshold)}
        onValueChange={(value) => onThresholdChange(Number(value))}
      >
        <SelectTrigger id="rating-threshold" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {RATING_OPTIONS.map((rating) => (
              <SelectItem key={rating} value={String(rating)}>
                {t("stars", { count: rating })}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div>
      <label
        htmlFor="redirect-url"
        className="mb-1 block text-xs font-semibold text-zinc-700"
      >
        {t("url")}
      </label>
      <Input
        id="redirect-url"
        type="url"
        placeholder={t("urlPlaceholder")}
        aria-invalid={!!urlError}
        value={redirectUrl}
        onChange={(event) => onRedirectUrlChange(event.target.value)}
      />
      {urlError ? (
        <p className="mt-1 text-xs text-red-600">{urlError}</p>
      ) : (
        <p className="mt-1 text-base text-zinc-400">
          {t("urlHelp")}
        </p>
      )}
    </div>
  </>
  );
};
