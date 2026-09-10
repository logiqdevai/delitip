import type { CSSProperties, FC } from "react";
import {
  ScanTipReviewRow,
  TemplateBrandMark,
  TemplateQrBlock,
} from "@/app/dashboard/access/components/qr-templates/qr-template-shared";
import type { TemplateElement } from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface TemplateElementRendererProps {
  element: TemplateElement;
  store: Store;
  qrLabel: string;
  qrObjectUrl: string;
  logoObjectUrl?: string | null;
}

function positionStyle(element: TemplateElement): CSSProperties {
  return {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
  };
}

export const TemplateElementRenderer: FC<TemplateElementRendererProps> = ({
  element,
  store,
  qrLabel,
  qrObjectUrl,
  logoObjectUrl,
}) => {
  switch (element.kind) {
    case "text":
      return (
        <div
          style={{
            ...positionStyle(element),
            color: element.color,
            fontFamily:
              element.fontFamily === "serif"
                ? "var(--qr-template-serif)"
                : "var(--font-sans)",
            fontSize: element.fontSize,
            fontWeight: element.fontWeight,
            textAlign: element.align,
            letterSpacing: element.letterSpacing,
            textTransform: element.uppercase ? "uppercase" : undefined,
            lineHeight: 1.25,
            ...(element.lineClamp
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: element.lineClamp,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : { overflow: "hidden" }),
          }}
        >
          {element.content}
        </div>
      );

    case "image":
      return (
        <div style={positionStyle(element)}>
          <TemplateBrandMark
            store={store}
            logoObjectUrl={logoObjectUrl}
            color={element.iconColor}
            shape={element.shape}
            backdrop={element.backdrop}
            size={element.width}
          />
        </div>
      );

    case "qr":
      return (
        <div style={positionStyle(element)}>
          <TemplateQrBlock
            qrObjectUrl={qrObjectUrl}
            qrLabel={qrLabel}
            size={element.width}
            showBadge={element.showBadge}
          />
        </div>
      );

    case "iconRow":
      return (
        <div
          style={positionStyle(element)}
          className="flex items-center justify-center"
        >
          <ScanTipReviewRow
            color={element.color}
            labelFontSize={element.labelFontSize}
          />
        </div>
      );

    case "band":
      return (
        <div
          style={{
            ...positionStyle(element),
            backgroundColor: element.color,
            borderTopLeftRadius: element.borderRadius?.topLeft,
            borderTopRightRadius: element.borderRadius?.topRight,
            borderBottomLeftRadius: element.borderRadius?.bottomLeft,
            borderBottomRightRadius: element.borderRadius?.bottomRight,
          }}
        />
      );
  }
};
