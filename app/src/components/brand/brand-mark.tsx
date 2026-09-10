import { type FC } from "react";
import { cn } from "@/lib/utils";
import { BrandMarkGlyph } from "./brand-mark-glyph";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "size-7 rounded-xl",
  md: "size-8 rounded-xl",
  lg: "size-12 rounded-2xl",
} as const;

export const BrandMark: FC<BrandMarkProps> = ({
  size = "md",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-electric-lime shadow-inner shadow-electric-lime/40",
        sizeClass[size],
        className
      )}
    >
      <BrandMarkGlyph />
    </div>
  );
};
