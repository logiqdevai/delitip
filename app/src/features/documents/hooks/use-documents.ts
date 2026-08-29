import { useMutation } from "@tanstack/react-query";
import {
  deleteDocument,
  uploadDocument,
} from "@/features/documents/services/documents.services";
import type { DocumentType } from "@/features/documents/interfaces/documents.interfaces";
import { toast } from "@/components/ui/toast";

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type?: DocumentType }) =>
      uploadDocument(file, type),
    onError: (error: Error) => {
      toast.add({
        title: "Could not upload image",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteDocument = () => {
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onError: (error: Error) => {
      toast.add({
        title: "Could not remove image",
        description: error.message,
        type: "error",
      });
    },
  });
};
