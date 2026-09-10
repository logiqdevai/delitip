import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { ArchedBandCardTemplate } from "@/app/dashboard/access/components/qr-templates/arched-band-card-template";
import { ClassicCardTemplate } from "@/app/dashboard/access/components/qr-templates/classic-card-template";
import { CtaBandCardTemplate } from "@/app/dashboard/access/components/qr-templates/cta-band-card-template";
import type {
  QrTemplateId,
  QrTemplateRenderProps,
} from "@/features/qr-templates/interfaces/qr-templates.interfaces";

type QrTemplateComponent = ForwardRefExoticComponent<
  QrTemplateRenderProps & RefAttributes<HTMLDivElement>
>;

// Wire a new template's component here (alongside its entry in qr-templates.config.ts)
// to make it available in QrTemplateDialog.
export const QR_TEMPLATE_COMPONENTS: Record<QrTemplateId, QrTemplateComponent> = {
  "classic-card": ClassicCardTemplate,
  "arched-band-card": ArchedBandCardTemplate,
  "cta-band-card": CtaBandCardTemplate,
};
