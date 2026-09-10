"use client";

import type { FC } from "react";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import { cn } from "@/lib/utils";

// Friendlier labels for the element-id slugs defined in qr-template-layouts.config.ts.
const ELEMENT_LABELS: Record<string, string> = {
  brandMark: "Logo / Icon",
  storeName: "Store Name",
  industryLabel: "Category Label",
  headline: "Headline",
  qr: "QR Code",
  scanTipReviewCaption: "Caption",
  scanTipReview: "Scan / Tip / Review",
  footerWordmark: "Footer Text",
  footerBand: "Footer Band",
  tagline: "Tagline",
  scanCta: "Call To Action",
};

export const TemplateElementList: FC = () => {
  const { elements, selectedElementId, selectElement } = useTemplateEditor();

  return (
    <div className="space-y-0.5 p-2">
      {elements.map((element) => (
        <button
          key={element.id}
          type="button"
          onClick={() => selectElement(element.id)}
          className={cn(
            "flex w-full items-center rounded-lg border-l-2 px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
            element.id === selectedElementId
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-transparent text-zinc-600 hover:bg-zinc-50",
          )}
        >
          {ELEMENT_LABELS[element.id] ?? element.id}
        </button>
      ))}
    </div>
  );
};
