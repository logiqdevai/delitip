"use client";

import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import type { TemplateElement } from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";

type HandlePosition = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: HandlePosition[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const MIN_SIZE = 12;
const HANDLE_SIZE = 10;

interface ResizeStart {
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  handle: HandlePosition;
}

// The QR must never distort (protects scannability), and a circular logo/icon
// must stay a circle - both always resize with a locked 1:1 aspect ratio.
function isAspectLocked(element: TemplateElement): boolean {
  if (element.kind === "qr") return true;
  if (element.kind === "image" && element.shape === "circle") return true;
  return false;
}

function handleStyle(handle: HandlePosition, width: number, height: number): CSSProperties {
  const half = HANDLE_SIZE / 2;
  const cursors: Record<HandlePosition, string> = {
    nw: "nwse-resize",
    n: "ns-resize",
    ne: "nesw-resize",
    e: "ew-resize",
    se: "nwse-resize",
    s: "ns-resize",
    sw: "nesw-resize",
    w: "ew-resize",
  };
  const positions: Record<HandlePosition, { left: number; top: number }> = {
    nw: { left: -half, top: -half },
    n: { left: width / 2 - half, top: -half },
    ne: { left: width - half, top: -half },
    e: { left: width - half, top: height / 2 - half },
    se: { left: width - half, top: height - half },
    s: { left: width / 2 - half, top: height - half },
    sw: { left: -half, top: height - half },
    w: { left: -half, top: height / 2 - half },
  };
  return {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    cursor: cursors[handle],
    ...positions[handle],
  };
}

interface TemplateElementResizeHandlesProps {
  element: TemplateElement;
  zoom: number;
}

export function TemplateElementResizeHandles({
  element,
  zoom,
}: TemplateElementResizeHandlesProps) {
  const { updateElement } = useTemplateEditor();
  const startRef = useRef<ResizeStart | null>(null);
  const aspectLocked = isAspectLocked(element);

  const onPointerDown =
    (handle: HandlePosition) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      startRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        handle,
      };
    };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    if (!start) return;

    const dx = (event.clientX - start.pointerX) / zoom;
    const dy = (event.clientY - start.pointerY) / zoom;
    const next = { x: start.x, y: start.y, width: start.width, height: start.height };

    if (start.handle.includes("e")) {
      next.width = Math.max(MIN_SIZE, start.width + dx);
    }
    if (start.handle.includes("s")) {
      next.height = Math.max(MIN_SIZE, start.height + dy);
    }
    if (start.handle.includes("w")) {
      const width = Math.max(MIN_SIZE, start.width - dx);
      next.x = start.x + (start.width - width);
      next.width = width;
    }
    if (start.handle.includes("n")) {
      const height = Math.max(MIN_SIZE, start.height - dy);
      next.y = start.y + (start.height - height);
      next.height = height;
    }

    if (aspectLocked) {
      const size = Math.max(next.width, next.height, MIN_SIZE);
      if (start.handle.includes("w")) next.x = start.x + (start.width - size);
      if (start.handle.includes("n")) next.y = start.y + (start.height - size);
      next.width = size;
      next.height = size;
    }

    updateElement(element.id, next);
  };

  const onPointerUp = () => {
    startRef.current = null;
  };

  return (
    <>
      {HANDLES.map((handle) => (
        <div
          key={handle}
          style={handleStyle(handle, element.width, element.height)}
          className="rounded-full border-2 border-white bg-brand-600 shadow"
          onPointerDown={onPointerDown(handle)}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      ))}
    </>
  );
}
