export const DocumentTypes = {
  LOGO: "LOGO",
  BANNER: "BANNER",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  PDF: "PDF",
  DOCUMENT: "DOCUMENT",
  OTHER: "OTHER",
} as const;
export type DocumentType = (typeof DocumentTypes)[keyof typeof DocumentTypes];

export interface UploadedDocument {
  id: string;
  user_uuid: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  type: DocumentType;
  created_at: string;
}
