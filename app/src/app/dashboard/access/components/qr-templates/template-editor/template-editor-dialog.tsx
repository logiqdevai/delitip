"use client";

import { type FC, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { TemplateEditorCanvasArea } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-canvas-area";
import { TemplateEditorToolbar } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-toolbar";
import { TemplateElementList } from "@/app/dashboard/access/components/qr-templates/template-editor/template-element-list";
import { TemplateInspectorPanel } from "@/app/dashboard/access/components/qr-templates/template-editor/template-inspector-panel";
import {
  TemplateEditorProvider,
  useTemplateEditor,
} from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface TemplateEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store;
  qrLabel: string;
  tipUrl: string;
  initialTemplateId: QrTemplateId;
}

export const TemplateEditorDialog: FC<TemplateEditorDialogProps> = ({
  open,
  onOpenChange,
  store,
  qrLabel,
  tipUrl,
  initialTemplateId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <TemplateEditorProvider
      store={store}
      qrLabel={qrLabel}
      tipUrl={tipUrl}
      initialTemplateId={initialTemplateId}
      open={open}
    >
      <TemplateEditorDialogShell
        open={open}
        onOpenChange={onOpenChange}
        canvasRef={canvasRef}
      />
    </TemplateEditorProvider>
  );
};

interface TemplateEditorDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

const TemplateEditorDialogShell: FC<TemplateEditorDialogShellProps> = ({
  open,
  onOpenChange,
  canvasRef,
}) => {
  const { isDirty } = useTemplateEditor();
  const discardConfirm = useConfirmationDialog();

  // Routes every way of closing this dialog (the toolbar's X, Escape, an
  // attempted backdrop dismissal) through the same unsaved-changes gate.
  const requestOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    if (isDirty) {
      discardConfirm.openDialog();
      return;
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={requestOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[85vh] max-h-[900px] w-[95vw] max-w-[1100px] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[1100px]"
        >
          <TemplateEditorToolbar
            canvasRef={canvasRef}
            onRequestClose={() => requestOpenChange(false)}
          />
          <div className="flex min-h-0 flex-1">
            <div className="w-44 shrink-0 overflow-y-auto border-r border-zinc-100">
              <TemplateElementList />
            </div>
            <TemplateEditorCanvasArea canvasRef={canvasRef} />
            <div className="w-72 shrink-0 overflow-y-auto border-l border-zinc-100">
              <TemplateInspectorPanel />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        state={discardConfirm}
        title="Discard unsaved changes?"
        description="Closing now will discard your unsaved edits to this design."
        confirmLabel="Discard changes"
        variant="destructive"
        onConfirm={() => onOpenChange(false)}
      />
    </>
  );
};
