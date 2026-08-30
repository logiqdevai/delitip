"use client";

import { type FC } from "react";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  xs: "size-6 text-[10px]",
  sm: "size-7 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-xs",
  xl: "size-12 text-sm",
} as const;

export type EmployeeAvatarSize = keyof typeof SIZE_CLASS;

export type EmployeeAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: EmployeeAvatarSize;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export const EmployeeAvatar: FC<EmployeeAvatarProps> = ({
  name,
  photoUrl,
  size = "md",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-charcoal font-bold text-paper-offwhite",
        SIZE_CLASS[size],
        className,
      )}
      aria-hidden={photoUrl ? undefined : true}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
};
