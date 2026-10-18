"use client";

import { type FC, useState } from "react";
import { ImagePicker } from "@/components/ui/image-picker";
import {
  useDeleteDocument,
  useUploadDocument,
} from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import { deleteDocument as deleteDocumentRequest } from "@/features/documents/services/documents.services";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface BrandingImagePickersProps {
  store: Store;
}

/**
 * Logo and cover pickers. Uploads are applied to the store immediately
 * (upload, attach to store, delete the previous document) rather than with
 * the surrounding form's save button.
 */
export const BrandingImagePickers: FC<BrandingImagePickersProps> = ({
  store,
}) => {
  const updateStore = useUpdateStore();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const [uploadingMode, setUploadingMode] = useState<"logo" | "cover" | null>(
    null,
  );

  const disabled = deleteDocument.isPending || updateStore.isPending;

  return (
    <div className="grid grid-cols-1 gap-5">
      <ImagePicker
        mode="logo"
        value={store.logo_document?.url}
        isPending={uploadingMode === "logo"}
        disabled={disabled}
        onChange={(file) => {
          setUploadingMode("logo");
          const previousId = store.logo_document_id;
          uploadDocument.mutate(
            { file, type: DocumentTypes.LOGO },
            {
              onSuccess: (document) =>
                updateStore.mutate(
                  {
                    id: store.id,
                    payload: { logo_document_id: document.id },
                  },
                  {
                    onSuccess: () => {
                      if (previousId) {
                        void deleteDocumentRequest(previousId).catch(
                          () => undefined,
                        );
                      }
                    },
                  },
                ),
              onSettled: () => setUploadingMode(null),
            },
          );
        }}
        onClear={
          store.logo_document_id
            ? () =>
                deleteDocument.mutate(store.logo_document_id!, {
                  onSuccess: () =>
                    updateStore.mutate({
                      id: store.id,
                      payload: { logo_document_id: null },
                    }),
                })
            : undefined
        }
      />
      <ImagePicker
        mode="cover"
        value={store.cover_document?.url}
        isPending={uploadingMode === "cover"}
        disabled={disabled}
        onChange={(file) => {
          setUploadingMode("cover");
          const previousId = store.cover_document_id;
          uploadDocument.mutate(
            { file, type: DocumentTypes.BANNER },
            {
              onSuccess: (document) =>
                updateStore.mutate(
                  {
                    id: store.id,
                    payload: { cover_document_id: document.id },
                  },
                  {
                    onSuccess: () => {
                      if (previousId) {
                        void deleteDocumentRequest(previousId).catch(
                          () => undefined,
                        );
                      }
                    },
                  },
                ),
              onSettled: () => setUploadingMode(null),
            },
          );
        }}
        onClear={
          store.cover_document_id
            ? () =>
                deleteDocument.mutate(store.cover_document_id!, {
                  onSuccess: () =>
                    updateStore.mutate({
                      id: store.id,
                      payload: { cover_document_id: null },
                    }),
                })
            : undefined
        }
      />
    </div>
  );
};
