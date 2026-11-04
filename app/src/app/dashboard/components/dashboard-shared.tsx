import { type FC, type ReactNode } from "react";
import { Sparkles, Wine, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const badgeConfig = {
  "super-fast": { labelKey: "superFast", Icon: Zap },
  "great-drinks": { labelKey: "greatDrinks", Icon: Wine },
  "friendly-vibe": { labelKey: "friendlyVibe", Icon: Sparkles },
} as const;

type BadgeKey = keyof typeof badgeConfig;

interface RecognitionBadgeProps {
  badge: BadgeKey;
  className?: string;
}

export const RecognitionBadge: FC<RecognitionBadgeProps> = ({
  badge,
  className,
}) => {
  const t = useTranslations("dashboard.shell.badges");
  const { labelKey, Icon } = badgeConfig[badge];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-caption font-semibold text-brand-700",
        className
      )}
    >
      <Icon className="size-3" strokeWidth={2} />
      {t(labelKey)}
    </span>
  );
};

interface StatusPillProps {
  onShift: boolean;
}

export const StatusPill: FC<StatusPillProps> = ({ onShift }) => {
  const t = useTranslations("dashboard.shell.badges");

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-caption font-bold",
        onShift
          ? "bg-brand-50 text-brand-700"
          : "bg-neutral-fill font-medium text-zinc-500"
      )}
    >
      {onShift ? t("onShift") : t("offShift")}
    </span>
  );
};

interface DashboardPageHeaderProps {
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}

export const DashboardPageHeader: FC<DashboardPageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">{title}</h1>
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export type { BadgeKey };
