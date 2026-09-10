import type {
  TemplateCanvasConfig,
  TemplateElement,
} from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";

export interface QrTemplateCustomization {
  id: string;
  store_id: string;
  template_id: string;
  canvas: TemplateCanvasConfig;
  elements: TemplateElement[];
  created_at: string;
  updated_at: string;
}

export interface UpsertQrTemplateCustomizationPayload {
  canvas: TemplateCanvasConfig;
  elements: TemplateElement[];
}
