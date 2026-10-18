"use client";

import { type FC } from "react";
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
}) => (
  <>
    <div>
      <label
        htmlFor="rating-threshold"
        className="mb-1 block text-xs font-semibold text-zinc-700"
      >
        Public prompt threshold
      </label>
      <Select
        items={RATING_OPTIONS.map((rating) => ({
          label: `${rating}+ stars`,
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
                {rating}+ stars
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
        Public review link (e.g. Google Business Profile)
      </label>
      <Input
        id="redirect-url"
        type="url"
        placeholder="https://g.page/r/your-business/review"
        aria-invalid={!!urlError}
        value={redirectUrl}
        onChange={(event) => onRedirectUrlChange(event.target.value)}
      />
      {urlError ? (
        <p className="mt-1 text-xs text-red-600">{urlError}</p>
      ) : (
        <p className="mt-1 text-[14px] text-zinc-400">
          Leave blank to skip the public redirect - high-rated customers still
          see a thank-you, just without an outbound link.
        </p>
      )}
    </div>
  </>
);
