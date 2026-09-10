import { forwardRef } from "react";
import { Heart } from "lucide-react";
import { getStoreIndustryLabel } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { templateSerif } from "@/app/dashboard/access/components/qr-templates/template-fonts";
import {
  TemplateBrandMark,
  TemplateQrBlock,
  getCardPalette,
  resolveHeadline,
} from "@/app/dashboard/access/components/qr-templates/qr-template-shared";
import type { QrTemplateRenderProps } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import { cn } from "@/lib/utils";

// Single-tone bordered card - the "Bella" / "Sunset Bar" / "Monarch Lounge" style
// from the reference set: one background color throughout, a thin inset frame,
// serif wordmark, and a plain text footer (no color-block band).
export const ClassicCardTemplate = forwardRef<
  HTMLDivElement,
  QrTemplateRenderProps
>(({ store, qrLabel, qrObjectUrl, logoObjectUrl }, ref) => {
  const { primary, secondary, onSecondary } = getCardPalette(store);
  const headline = resolveHeadline(store);

  return (
    <div
      ref={ref}
      style={{
        width: 300,
        height: 450,
        backgroundColor: secondary,
        color: onSecondary,
      }}
      className={cn("relative overflow-hidden", templateSerif.variable)}
    >
      <div
        className="absolute inset-3.5 flex flex-col items-center rounded-[10px] border px-6 pt-7 pb-5 text-center"
        style={{ borderColor: primary }}
      >
        <TemplateBrandMark
          store={store}
          logoObjectUrl={logoObjectUrl}
          color={primary}
        />

        <div
          className="mt-3 text-[21px] leading-tight font-bold tracking-[0.1em] uppercase"
          style={{ color: primary, fontFamily: "var(--qr-template-serif)" }}
        >
          {store.name}
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[9px] font-semibold tracking-[0.3em] uppercase opacity-60">
          <span className="h-px w-4 bg-current" />
          {getStoreIndustryLabel(store.industry)}
          <span className="h-px w-4 bg-current" />
        </div>

        <p
          className="mt-6 line-clamp-3 max-w-[210px] text-[16px] leading-snug font-semibold"
          style={{ fontFamily: "var(--qr-template-serif)" }}
        >
          {headline}
        </p>

        <div className="mt-auto flex flex-col items-center gap-3 pt-6">
          <TemplateQrBlock qrObjectUrl={qrObjectUrl} qrLabel={qrLabel} />
          <span className="text-[10px] font-medium tracking-wide opacity-70">
            Scan &middot; Tip &middot; Review
          </span>
        </div>

        <div
          className="mt-4 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] uppercase"
          style={{ color: primary }}
        >
          <Heart className="size-3" strokeWidth={2} fill="currentColor" />
          DelyTip
        </div>
      </div>
    </div>
  );
});
ClassicCardTemplate.displayName = "ClassicCardTemplate";
