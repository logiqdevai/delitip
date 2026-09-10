import { forwardRef } from "react";
import { Heart } from "lucide-react";
import { getStoreIndustryLabel } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { templateSerif } from "@/app/dashboard/access/components/qr-templates/template-fonts";
import {
  ScanTipReviewRow,
  TemplateBrandMark,
  TemplateQrBlock,
  getCardPalette,
  resolveHeadline,
} from "@/app/dashboard/access/components/qr-templates/qr-template-shared";
import type { QrTemplateRenderProps } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import { cn } from "@/lib/utils";

// Two-tone arch-top card with a Scan / Tip / Review icon row and a solid
// color-block footer band - the "The Garden" / "Basilico" / "Hair & Co." style.
export const ArchedBandCardTemplate = forwardRef<
  HTMLDivElement,
  QrTemplateRenderProps
>(({ store, qrLabel, qrObjectUrl, logoObjectUrl }, ref) => {
  const { primary, secondary, onSecondary, onPrimary } = getCardPalette(store);
  const headline = resolveHeadline(store);

  return (
    <div
      ref={ref}
      style={{
        width: 300,
        height: 450,
        backgroundColor: secondary,
        color: onSecondary,
        borderTopLeftRadius: 130,
        borderTopRightRadius: 130,
      }}
      className={cn(
        "relative flex flex-col items-center overflow-hidden px-7 pt-9 text-center",
        templateSerif.variable,
      )}
    >
      <TemplateBrandMark
        store={store}
        logoObjectUrl={logoObjectUrl}
        color={primary}
      />

      <div
        className="mt-3 text-[20px] leading-tight font-bold tracking-[0.08em] uppercase"
        style={{ color: primary, fontFamily: "var(--qr-template-serif)" }}
      >
        {store.name}
      </div>
      <div className="mt-1 text-[9px] font-semibold tracking-[0.3em] uppercase opacity-60">
        {getStoreIndustryLabel(store.industry)}
      </div>

      <p
        className="mt-5 line-clamp-2 max-w-[205px] text-[15px] leading-snug font-semibold"
        style={{ fontFamily: "var(--qr-template-serif)" }}
      >
        {headline}
      </p>

      <div className="mt-5">
        <ScanTipReviewRow color={primary} />
      </div>

      <div className="mt-5">
        <TemplateQrBlock qrObjectUrl={qrObjectUrl} qrLabel={qrLabel} size={116} />
      </div>

      <div
        className="mt-auto flex w-full items-center justify-center gap-1.5 py-3.5"
        style={{ backgroundColor: primary, color: onPrimary }}
      >
        <Heart className="size-3" strokeWidth={2} fill="currentColor" />
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase">
          DelyTip
        </span>
      </div>
    </div>
  );
});
ArchedBandCardTemplate.displayName = "ArchedBandCardTemplate";
