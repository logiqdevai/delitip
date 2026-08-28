import { type FC } from "react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "size-7 rounded-xl text-xs",
  md: "size-8 rounded-xl text-sm",
  lg: "size-12 rounded-2xl text-lg",
} as const;

export const BrandMark: FC<BrandMarkProps> = ({
  size = "md",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-electric-lime font-bold text-ink-charcoal shadow-inner shadow-electric-lime/40",
        sizeClass[size],
        className
      )}
    >
      d•
    </div>
  );
};
