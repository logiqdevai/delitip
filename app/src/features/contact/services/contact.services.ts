import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  ContactPayload,
  ContactResponse,
} from "@/features/contact/interfaces/contact.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

export const submitContactForm = async (
  payload: ContactPayload,
): Promise<ContactResponse> => {
  try {
    const response = await axiosInstance.post<ContactResponse>(
      ApiRoutes.contact,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't send your message. Please try again."),
    );
  }
};
