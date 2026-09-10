import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import { templateSerif } from "@/app/dashboard/access/components/qr-templates/template-fonts";
import {
  TemplateBrandMark,
  TemplateQrBlock,
  getCardPalette,
  resolveHeadline,
} from "@/app/dashboard/access/components/qr-templates/qr-template-shared";
import type { QrTemplateRenderProps } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import { cn } from "@/lib/utils";

// Flat card with a bold color-block CTA footer - the "Kouzina Greek Kitchen" style.
export const CtaBandCardTemplate = forwardRef<
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
        className="mt-3 text-[19px] leading-tight font-bold tracking-[0.08em] uppercase"
        style={{ color: primary, fontFamily: "var(--qr-template-serif)" }}
      >
        {store.name}
      </div>

      <p
        className="mt-4 line-clamp-2 max-w-[215px] text-[18px] leading-snug font-bold"
        style={{ fontFamily: "var(--qr-template-serif)" }}
      >
        {headline}
      </p>
      <p
        className="mt-2 text-[11px] font-medium opacity-80"
        style={{ color: primary }}
      >
        Tip your favorite team member.
      </p>

      <div className="mt-6">
        <TemplateQrBlock qrObjectUrl={qrObjectUrl} qrLabel={qrLabel} />
      </div>

      <div
        className="mt-auto flex w-full flex-col items-center gap-1 py-4"
        style={{ backgroundColor: primary, color: onPrimary }}
      >
        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
          <ArrowRight className="size-3.5" strokeWidth={2.5} />
          Scan to begin
        </span>
        <span className="text-[13px] font-bold tracking-[0.25em] uppercase">
          DelyTip
        </span>
      </div>
    </div>
  );
});
CtaBandCardTemplate.displayName = "CtaBandCardTemplate";
