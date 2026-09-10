"use client";

import { type FC, type Ref, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TEMPLATE_CANVAS_HEIGHT,
  TEMPLATE_CANVAS_WIDTH,
  TemplateCanvas,
} from "@/app/dashboard/access/components/qr-templates/template-canvas";
import { TemplateEditorOverlay } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-overlay";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;

interface TemplateEditorCanvasAreaProps {
  canvasRef: Ref<HTMLDivElement>;
}

export const TemplateEditorCanvasArea: FC<TemplateEditorCanvasAreaProps> = ({
  canvasRef,
}) => {
  const [zoom, setZoom] = useState(1.3);
  const {
    elements,
    canvas,
    structural,
    store,
    qrLabel,
    qrObjectUrl,
    logoObjectUrl,
    isLoading,
    isReady,
  } = useTemplateEditor();

  const ready = isReady && !isLoading && !!qrObjectUrl;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-auto bg-zinc-100 p-8">
      {!ready || !qrObjectUrl ? (
        <Skeleton
          style={{
            width: TEMPLATE_CANVAS_WIDTH * zoom,
            height: TEMPLATE_CANVAS_HEIGHT * zoom,
          }}
        />
      ) : (
        <div
          style={{
            width: TEMPLATE_CANVAS_WIDTH * zoom,
            height: TEMPLATE_CANVAS_HEIGHT * zoom,
          }}
          className="relative shrink-0"
        >
          <div
            style={{
              width: TEMPLATE_CANVAS_WIDTH,
              height: TEMPLATE_CANVAS_HEIGHT,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 shadow-lg"
          >
            <TemplateCanvas
              ref={canvasRef}
              elements={elements}
              canvas={canvas}
              structural={structural}
              store={store}
              qrLabel={qrLabel}
              qrObjectUrl={qrObjectUrl}
              logoObjectUrl={logoObjectUrl}
            />
            <TemplateEditorOverlay zoom={zoom} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-500 shadow-xs">
        <button
          type="button"
          aria-label="Zoom out"
          className="flex size-6 items-center justify-center rounded-full hover:bg-zinc-50"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.2).toFixed(2))))}
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-9 text-center font-medium tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          className="flex size-6 items-center justify-center rounded-full hover:bg-zinc-50"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.2).toFixed(2))))}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
