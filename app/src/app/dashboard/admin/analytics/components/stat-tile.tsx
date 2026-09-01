import { type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const toneClass = {
  neutral: "bg-neutral-fill text-zinc-600",
  brand: "bg-brand-50 text-brand-700",
  attention: "bg-amber-50 text-amber-700",
} as const;

interface StatTileProps {
  label: string;
  value: string;
  helpText?: string;
  icon: ReactNode;
  tone?: keyof typeof toneClass;
}

export const StatTile: FC<StatTileProps> = ({
  label,
  value,
  helpText,
  icon,
  tone = "neutral",
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-500">{label}</span>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg [&_svg]:size-3.5",
            toneClass[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-1.5 text-2xl font-extrabold text-ink-charcoal">
        {value}
      </div>
      {helpText ? (
        <p className="mt-1 text-[11px] text-zinc-400">{helpText}</p>
      ) : null}
    </div>
  );
};
