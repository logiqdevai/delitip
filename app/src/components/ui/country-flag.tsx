"use client";

import type { FC } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

export const CountryFlag: FC<CountryFlagProps> = ({
  countryCode,
  className,
}) => {
  const Flag = Flags[countryCode as keyof typeof Flags];
  if (!Flag) return null;

  return (
    <Flag
      role="img"
      aria-hidden="true"
      className={cn(
        "h-3 w-4 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10",
        className,
      )}
    />
  );
};
