import { type FC } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BarChart3,
  Palette,
  QrCode,
  Rocket,
  ShieldCheck,
  Star,
  UserCircle,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/routes/routes";
import type { HelpCategory } from "@/interfaces/help-center.interfaces";

const HelpCategoryIcons: Record<string, LucideIcon> = {
  Rocket,
  Users,
  QrCode,
  Wallet,
  Star,
  BarChart3,
  Palette,
  Bell,
  UserCircle,
  ShieldCheck,
};

interface HelpCategoryCardProps {
  category: HelpCategory;
}

export const HelpCategoryCard: FC<HelpCategoryCardProps> = ({ category }) => {
  const Icon = HelpCategoryIcons[category.icon] ?? Rocket;

  return (
    <Link
      href={Routes.help.category(category.slug)}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-electric-lime/20 text-ink-charcoal">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <span className="text-base font-bold text-ink-charcoal">
        {category.title}
      </span>
      <p className="text-sm leading-relaxed text-zinc-600">
        {category.description}
      </p>
      <span className="mt-auto flex items-center gap-1.5 text-xs font-bold text-zinc-500 group-hover:text-ink-charcoal">
        {category.articles.length} article
        {category.articles.length === 1 ? "" : "s"}
        <ArrowRight className="size-3.5 shrink-0" strokeWidth={2} />
      </span>
    </Link>
  );
};
