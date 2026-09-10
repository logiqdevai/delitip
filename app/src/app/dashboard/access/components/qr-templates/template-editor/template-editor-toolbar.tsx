"use client";

import { type FC, type RefObject, useState } from "react";
import { Download, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { toast } from "@/components/ui/toast";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import { QR_TEMPLATES } from "@/features/qr-templates/config/qr-templates.config";
import { downloadTemplatePdf } from "@/features/qr-templates/utils/qr-template-export.utils";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";

interface TemplateEditorToolbarProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  onRequestClose: () => void;
}

export const TemplateEditorToolbar: FC<TemplateEditorToolbarProps> = ({
  canvasRef,
  onRequestClose,
}) => {
  const {
    templateId,
    setTemplateId,
    isDirty,
    isSaving,
    isResetting,
    save,
    resetToDefault,
    qrLabel,
  } = useTemplateEditor();
  const [downloading, setDownloading] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] =
    useState<QrTemplateId | null>(null);
  const switchConfirm = useConfirmationDialog();
  const resetConfirm = useConfirmationDialog();

  const requestSwitch = (id: QrTemplateId) => {
    if (id === templateId) return;
    if (isDirty) {
      setPendingTemplateId(id);
      switchConfirm.openDialog();
      return;
    }
    setTemplateId(id);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      await downloadTemplatePdf(
        canvasRef.current,
        `${qrLabel || "qr"}-${templateId}`,
      );
    } catch (err) {
      toast.add({
        title: "Could not download template",
        description: err instanceof Error ? err.message : "Please try again.",
        type: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {QR_TEMPLATES.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="xs"
            variant={option.id === templateId ? "secondary" : "outline"}
            className="rounded-full"
            onClick={() => requestSwitch(option.id)}
          >
            {option.name}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isResetting}
          onClick={resetConfirm.openDialog}
        >
          <RotateCcw data-icon="inline-start" className="size-3.5" />
          Reset
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={downloading}
          onClick={() => void handleDownload()}
        >
          <Download data-icon="inline-start" className="size-3.5" />
          {downloading ? "Preparing…" : "Download PDF"}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!isDirty || isSaving}
          onClick={() => void save()}
        >
          {isSaving ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRequestClose}
          aria-label="Close editor"
        >
          <X className="size-4" />
        </Button>
      </div>

      <ConfirmationDialog
        state={switchConfirm}
        title="Discard unsaved changes?"
        description="Switching templates will discard your unsaved edits to this design."
        confirmLabel="Discard changes"
        variant="destructive"
        onConfirm={() => {
          if (pendingTemplateId) setTemplateId(pendingTemplateId);
          setPendingTemplateId(null);
        }}
      />
      <ConfirmationDialog
        state={resetConfirm}
        title="Reset this design?"
        description="This deletes your saved customization and reverts to the default layout. This can't be undone."
        confirmLabel="Reset to default"
        variant="destructive"
        isPending={isResetting}
        onConfirm={() => resetToDefault()}
      />
    </div>
  );
};
