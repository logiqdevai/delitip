"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import { cn } from "@/lib/utils";

export const TemplateElementList: FC = () => {
  const t = useTranslations("dashboard.access.templateEditor.elements");
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
          {t.has(element.id) ? t(element.id) : element.id}
        </button>
      ))}
    </div>
  );
};
