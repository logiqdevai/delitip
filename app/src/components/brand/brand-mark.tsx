import { type FC } from "react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "size-7",
  md: "size-8",
  lg: "size-12",
} as const;

export const BrandMark: FC<BrandMarkProps> = ({
  size = "md",
  className,
}) => {
  return (
    <img
      src="/delitip.png"
      alt="delitip"
      className={cn(
        "shrink-0 rounded-full object-contain",
        sizeClass[size],
        className
      )}
    />
  );
};
