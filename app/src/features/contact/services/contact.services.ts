import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  ContactPayload,
  ContactResponse,
} from "@/features/contact/interfaces/contact.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === "string") {
      return message[0];
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

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
      getApiErrorMessage(error, "Failed to send your message. Please try again."),
    );
  }
};
