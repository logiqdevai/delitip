"use client";

import { createContext, useContext } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import type { QrEditorFormValues } from "@/app/dashboard/access/qr/validation-schemas/qr-editor.schema";

export interface QrEditorContextValue {
  form: UseFormReturn<QrEditorFormValues>;
  /** Persisted store (server state) — used for images and identity, not for drafts. */
  store: Store;
  /** Persisted QR code; null while creating. */
  qr: QrCode | null;
  isEdit: boolean;
  isDirty: boolean;
  isSaving: boolean;
  save: () => Promise<void>;
  discard: () => void;
}

export const QrEditorContext = createContext<QrEditorContextValue | null>(null);

export const useQrEditor = (): QrEditorContextValue => {
  const context = useContext(QrEditorContext);
  if (!context) {
    throw new Error("useQrEditor must be used inside QrEditorProvider");
  }
  return context;
};
