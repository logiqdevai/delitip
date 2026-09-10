"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties } from "react";
import {
  TEMPLATE_CANVAS_HEIGHT,
  TEMPLATE_CANVAS_WIDTH,
} from "@/app/dashboard/access/components/qr-templates/template-canvas";
import { TemplateElementResizeHandles } from "@/app/dashboard/access/components/qr-templates/template-editor/template-element-resize-handles";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import type { TemplateElement } from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";
import { cn } from "@/lib/utils";

interface DraggableElementBoxProps {
  element: TemplateElement;
  zoom: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

function DraggableElementBox({
  element,
  zoom,
  selected,
  onSelect,
}: DraggableElementBoxProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });
  // dnd-kit's own onPointerDown (drag-start) lives in `listeners` - spreading
  // it after a plain onPointerDown prop would silently replace ours (same
  // key, last one wins), so merge them into one handler instead of spreading
  // listeners last.
  const { onPointerDown: dndPointerDown, ...restListeners } = listeners ?? {};

  const style: CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-move rounded-[2px]",
        selected
          ? "ring-2 ring-brand-600"
          : "ring-1 ring-transparent hover:ring-brand-300",
      )}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(element.id);
        dndPointerDown?.(event);
      }}
      {...restListeners}
      {...attributes}
    >
      {selected ? (
        <TemplateElementResizeHandles element={element} zoom={zoom} />
      ) : null}
    </div>
  );
}

export function TemplateEditorOverlay({ zoom }: { zoom: number }) {
  const { elements, selectedElementId, selectElement, updateElement } =
    useTemplateEditor();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (delta.x === 0 && delta.y === 0) return;
    const element = elements.find((item) => item.id === active.id);
    if (!element) return;
    updateElement(element.id, {
      x: element.x + delta.x / zoom,
      y: element.y + delta.y / zoom,
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{ width: TEMPLATE_CANVAS_WIDTH, height: TEMPLATE_CANVAS_HEIGHT }}
        className="absolute top-0 left-0"
        onPointerDown={() => selectElement(null)}
      >
        {elements.map((element) => (
          <DraggableElementBox
            key={element.id}
            element={element}
            zoom={zoom}
            selected={element.id === selectedElementId}
            onSelect={selectElement}
          />
        ))}
      </div>
    </DndContext>
  );
}
