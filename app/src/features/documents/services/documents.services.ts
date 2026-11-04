import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  DocumentType,
  UploadedDocument,
} from "@/features/documents/interfaces/documents.interfaces";
import { getErrorMessage } from "@/lib/api-error";

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
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't upload the file. Please try again."));
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.documents.byId(id));
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't remove the file. Please try again."));
  }
};
