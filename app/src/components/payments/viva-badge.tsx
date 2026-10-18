import { type FC } from "react";
import { cn } from "@/lib/utils";

interface VivaBadgeProps {
  label?: string;
  className?: string;
}

// Official viva.com logo (white on Viva navy). The source image carries wide
// padding, so it is scaled up inside a clipped navy pill to crop to the mark.
export const VivaBadge: FC<VivaBadgeProps> = ({ label, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2.5 text-xs text-zinc-500",
        className,
      )}
    >
      {label ? <span>{label}</span> : null}
      <span className="relative block h-9 w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#1F263A]">
        <img
          src="/brand/viva-com-logo.png"
          alt="viva.com"
          className="absolute inset-0 size-full scale-[1.7] object-cover"
        />
      </span>
    </div>
  );
};
