"use client";

import { type FC, useState } from "react";
import { Palette } from "lucide-react";
import { TemplateEditorDialog } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-dialog";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { Button } from "@/components/ui/button";
import { QR_TEMPLATES } from "@/features/qr-templates/config/qr-templates.config";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import { getAbsoluteTipUrl } from "@/features/qr-codes/utils/qr-tip-url.utils";

export const PrintSection: FC = () => {
  const { store, qr } = useQrEditor();
  const [open, setOpen] = useState(false);

  return (
    <SectionCard section={QrEditorSections.PRINT}>
      {qr ? (
        <>
          <p className="text-xs text-zinc-500">
            Pick a printable card, tweak its layout and download it as a PDF.
            Card designs are saved separately from this form.
          </p>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            <Palette data-icon="inline-start" className="size-3.5" />
            Open card designer
          </Button>
          <TemplateEditorDialog
            open={open}
            onOpenChange={setOpen}
            store={store}
            qrLabel={qr.label}
            tipUrl={getAbsoluteTipUrl(store.slug, qr.code)}
            initialTemplateId={QR_TEMPLATES[0].id}
          />
        </>
      ) : (
        <p className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
          Save this QR code first, then come back to design a printable card.
        </p>
      )}
    </SectionCard>
  );
};
