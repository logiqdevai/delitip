import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  DocumentType,
  UploadedDocument,
} from "@/features/documents/interfaces/documents.interfaces";

export const uploadDocument = async (
  file: File,
  type?: DocumentType,
): Promise<UploadedDocument> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (type) formData.append("type", type);

    const response = await axiosInstance.post<UploadedDocument>(
      ApiRoutes.documents.prefix,
      formData,
    );
    return response.data;
  } catch {
    throw new Error("Failed to upload image. Please try again.");
  }
};
