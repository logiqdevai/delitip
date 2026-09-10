import { forwardRef } from "react";
import { templateSerif } from "@/app/dashboard/access/components/qr-templates/template-fonts";
import { TemplateElementRenderer } from "@/app/dashboard/access/components/qr-templates/template-element-renderer";
import { getCardPalette } from "@/features/qr-templates/utils/qr-template-content.utils";
import type {
  TemplateCanvasConfig,
  TemplateElement,
  TemplateStructuralShape,
} from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

export const TEMPLATE_CANVAS_WIDTH = 300;
export const TEMPLATE_CANVAS_HEIGHT = 450;

export interface TemplateCanvasProps {
  elements: TemplateElement[];
  canvas: TemplateCanvasConfig;
  structural: TemplateStructuralShape;
  store: Store;
  qrLabel: string;
  qrObjectUrl: string;
  logoObjectUrl?: string | null;
}

// The single rendering engine for both the editor canvas and the PDF export
// (via downloadTemplatePdf, which rasterizes exactly this node). Editor chrome
// (selection outlines, drag/resize handles) must render as a SIBLING of this
// component, never nested inside it, so exports stay free of editor UI.
export const TemplateCanvas = forwardRef<HTMLDivElement, TemplateCanvasProps>(
  (
    { elements, canvas, structural, store, qrLabel, qrObjectUrl, logoObjectUrl },
    ref,
  ) => {
    const { primary } = getCardPalette(store);

    return (
      <div
        ref={ref}
        style={{
          width: TEMPLATE_CANVAS_WIDTH,
          height: TEMPLATE_CANVAS_HEIGHT,
          backgroundColor: canvas.backgroundColor,
          borderTopLeftRadius: structural.borderTopLeftRadius,
          borderTopRightRadius: structural.borderTopRightRadius,
        }}
        className={cn("relative overflow-hidden", templateSerif.variable)}
      >
        {structural.frame ? (
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              inset: structural.frame.inset,
              borderRadius: structural.frame.borderRadius,
              border: `1px solid ${primary}`,
            }}
          />
        ) : null}

        {elements.map((element) => (
          <TemplateElementRenderer
            key={element.id}
            element={element}
            store={store}
            qrLabel={qrLabel}
            qrObjectUrl={qrObjectUrl}
            logoObjectUrl={logoObjectUrl}
          />
        ))}
      </div>
    );
  },
);
TemplateCanvas.displayName = "TemplateCanvas";
