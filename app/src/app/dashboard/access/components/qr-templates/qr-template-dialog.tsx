"use client";

import { type FC, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { QR_TEMPLATE_COMPONENTS } from "@/app/dashboard/access/components/qr-templates/template-registry";
import { QR_TEMPLATES } from "@/features/qr-templates/config/qr-templates.config";
import { useQrTemplateAssets } from "@/features/qr-templates/hooks/use-qr-template-assets";
import { downloadTemplatePdf } from "@/features/qr-templates/utils/qr-template-export.utils";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface QrTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store;
  qrLabel: string;
  tipUrl: string;
}

export const QrTemplateDialog: FC<QrTemplateDialogProps> = ({
  open,
  onOpenChange,
  store,
  qrLabel,
  tipUrl,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [templateId, setTemplateId] = useState<QrTemplateId>(
    QR_TEMPLATES[0].id,
  );
  const template =
    QR_TEMPLATES.find((item) => item.id === templateId) ?? QR_TEMPLATES[0];
  const TemplateComponent = QR_TEMPLATE_COMPONENTS[template.id];
  const { qrObjectUrl, logoObjectUrl, isLoading, error } = useQrTemplateAssets(
    open ? tipUrl : null,
    store.logo_document?.url,
  );

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await downloadTemplatePdf(
        cardRef.current,
        `${qrLabel || "qr"}-${template.id}`,
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (downloading) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-4 overflow-y-auto sm:max-w-md"
        showCloseButton={!downloading}
      >
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        {QR_TEMPLATES.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {QR_TEMPLATES.map((option) => (
              <Button
                key={option.id}
                type="button"
                size="xs"
                variant={option.id === template.id ? "secondary" : "outline"}
                disabled={downloading}
                onClick={() => setTemplateId(option.id)}
                className={cn(
                  "rounded-full",
                  option.id === template.id && "ring-1 ring-brand-200",
                )}
              >
                {option.name}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-center rounded-2xl bg-zinc-50 p-6">
          {isLoading || !qrObjectUrl ? (
            <Skeleton className="h-[450px] w-[300px]" />
          ) : (
            <TemplateComponent
              ref={cardRef}
              store={store}
              qrLabel={qrLabel}
              qrObjectUrl={qrObjectUrl}
              logoObjectUrl={logoObjectUrl}
            />
          )}
        </div>

        {error ? (
          <p className="text-center text-xs text-red-600">{error}</p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={downloading}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            disabled={downloading || isLoading || !qrObjectUrl}
            onClick={() => void handleDownload()}
          >
            <Download data-icon="inline-start" className="size-3.5" />
            {downloading ? "Preparing…" : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
