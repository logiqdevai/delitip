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
import type {
  Store,
  StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";
import {
  getCardPalette,
  resolveHeadline,
  type CardPalette,
} from "@/features/qr-templates/utils/qr-template-content.utils";
import { cn } from "@/lib/utils";

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

export { getCardPalette, resolveHeadline, type CardPalette };

interface TemplateBrandMarkProps {
  store: Store;
  logoObjectUrl?: string | null;
  color: string;
  shape?: "circle" | "square";
  backdrop?: boolean;
  size?: number;
}

/** A real logo gets a white backing plate (logos vary in shape/transparency); the industry-icon fallback is drawn plain, matching the reference cards' line-art marks. */
export function TemplateBrandMark({
  store,
  logoObjectUrl,
  color,
  shape = "circle",
  backdrop = true,
  size = 44,
}: TemplateBrandMarkProps) {
  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-lg";
  if (logoObjectUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "flex items-center justify-center overflow-hidden",
          roundedClass,
          backdrop && "bg-white shadow-sm",
        )}
      >
        <img src={logoObjectUrl} alt="" className="size-full object-cover" />
      </div>
    );
  }
  const Icon = INDUSTRY_ICONS[store.industry] ?? StoreIcon;
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
    >
      <Icon
        style={{ color, width: size * 0.64, height: size * 0.64 }}
        strokeWidth={1.75}
      />
    </div>
  );
}

interface TemplateQrBlockProps {
  qrObjectUrl: string;
  qrLabel: string;
  size?: number;
  showBadge?: boolean;
}

export function TemplateQrBlock({
  qrObjectUrl,
  qrLabel,
  size = 132,
  showBadge = true,
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
      {showBadge ? (
        <span
          aria-hidden
          className="absolute flex size-7 items-center justify-center rounded-full border border-black/15 bg-white text-[11px] font-bold text-ink-charcoal"
        >
          D
        </span>
      ) : null}
    </div>
  );
}

export function ScanTipReviewRow({
  color,
  labelFontSize = 9,
}: {
  color: string;
  labelFontSize?: number;
}) {
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
          style={{ fontSize: labelFontSize }}
          className="flex flex-col items-center gap-1 font-semibold tracking-wider uppercase"
        >
          <Icon className="size-4" strokeWidth={1.75} />
          {label}
        </span>
      ))}
    </div>
  );
}
