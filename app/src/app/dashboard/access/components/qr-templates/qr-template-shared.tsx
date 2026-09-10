import {
  BedDouble,
  Coffee,
  Dumbbell,
  HeartHandshake,
  Martini,
  ScanQrCode,
  Scissors,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Star,
  Store as StoreIcon,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { getReadableTextColor } from "@/lib/color";
import type {
  Store,
  StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";

// Shared building blocks reused across template layouts (framed / banded / CTA).
// Add a new industry icon here, not per-template, so every template stays in sync.

export const INDUSTRY_ICONS: Record<StoreIndustry, LucideIcon> = {
  RESTAURANT: UtensilsCrossed,
  CAFE: Coffee,
  BAR: Martini,
  HOTEL: BedDouble,
  SALON: Scissors,
  SPA: Sparkles,
  RETAIL: ShoppingBag,
  BARBERSHOP: Scissors,
  FITNESS: Dumbbell,
  FOOD_TRUCK: Truck,
  CLEANING: SprayCan,
  OTHER: StoreIcon,
};

const DEFAULT_HEADLINE =
  "Enjoying your experience? Thank our team with a tip or review.";

export function resolveHeadline(store: Store): string {
  const messages = store.welcome_message;
  if (!messages) return DEFAULT_HEADLINE;
  const primary = messages[store.primary_language.toLowerCase()]?.trim();
  if (primary) return primary;
  const first = Object.values(messages).find((value) => value?.trim());
  return first?.trim() || DEFAULT_HEADLINE;
}

export interface CardPalette {
  primary: string;
  secondary: string;
  onPrimary: string;
  onSecondary: string;
}

export function getCardPalette(store: Store): CardPalette {
  const primary = store.primary_color?.trim() || "#84cc16";
  const secondary = store.secondary_color?.trim() || "#18181b";
  return {
    primary,
    secondary,
    onPrimary: getReadableTextColor(primary),
    onSecondary: getReadableTextColor(secondary),
  };
}

interface TemplateBrandMarkProps {
  store: Store;
  logoObjectUrl?: string | null;
  color: string;
}

/** A real logo gets a white backing plate (logos vary in shape/transparency); the industry-icon fallback is drawn plain, matching the reference cards' line-art marks. */
export function TemplateBrandMark({
  store,
  logoObjectUrl,
  color,
}: TemplateBrandMarkProps) {
  if (logoObjectUrl) {
    return (
      <div className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
        <img src={logoObjectUrl} alt="" className="size-full object-cover" />
      </div>
    );
  }
  const Icon = INDUSTRY_ICONS[store.industry] ?? StoreIcon;
  return <Icon className="size-7" strokeWidth={1.75} style={{ color }} />;
}

interface TemplateQrBlockProps {
  qrObjectUrl: string;
  qrLabel: string;
  size?: number;
}

export function TemplateQrBlock({
  qrObjectUrl,
  qrLabel,
  size = 132,
}: TemplateQrBlockProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center rounded-lg border border-black/15 bg-white p-2"
    >
      <img
        src={qrObjectUrl}
        alt={`QR code for ${qrLabel}`}
        className="size-full object-contain"
      />
      <span
        aria-hidden
        className="absolute flex size-7 items-center justify-center rounded-full border border-black/15 bg-white text-[11px] font-bold text-ink-charcoal"
      >
        D
      </span>
    </div>
  );
}

export function ScanTipReviewRow({ color }: { color: string }) {
  const items = [
    { icon: ScanQrCode, label: "Scan" },
    { icon: HeartHandshake, label: "Tip" },
    { icon: Star, label: "Review" },
  ];
  return (
    <div className="flex items-center gap-5" style={{ color }}>
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="flex flex-col items-center gap-1 text-[9px] font-semibold tracking-wider uppercase"
        >
          <Icon className="size-4" strokeWidth={1.75} />
          {label}
        </span>
      ))}
    </div>
  );
}
