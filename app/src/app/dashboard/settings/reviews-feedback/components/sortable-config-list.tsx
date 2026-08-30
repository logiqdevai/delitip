"use client";

import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useId,
} from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export const SortableConfigRow: FC<{
  id: string;
  children: ReactNode;
  className?: string;
}> = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5",
        isDragging && "relative z-10 bg-white shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        className="flex size-5 shrink-0 cursor-grab items-center justify-center rounded text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      {children}
    </li>
  );
};

export const SortableConfigList: FC<{
  itemIds: string[];
  onReorder: (orderedIds: string[]) => void;
  children: ReactNode;
  className?: string;
}> = ({ itemIds, onReorder, children, className }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const dndId = useId();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(itemIds, oldIndex, newIndex));
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <ul
          className={cn(
            "divide-y divide-zinc-100 rounded-xl border border-zinc-200/80",
            className,
          )}
        >
          {children}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
