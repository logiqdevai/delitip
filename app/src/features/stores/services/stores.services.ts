import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateStorePayload,
  PublicStore,
  Store,
  StoreTranslatableField,
  UpdateStorePayload,
  UpdateStoreTranslationPayload,
} from "@/features/stores/interfaces/stores.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  }
  return fallback;
};

export const listStores = async (
  organizationId: string,
): Promise<Store[]> => {
  try {
    const response = await axiosInstance.get<Store[]>(
      ApiRoutes.organizations.stores(organizationId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load stores. Please try again.");
  }
};

export const getStore = async (id: string): Promise<Store> => {
  try {
    const response = await axiosInstance.get<Store>(ApiRoutes.stores.byId(id));
    return response.data;
  } catch {
    throw new Error("Failed to load store. Please try again.");
  }
};

export const createStore = async (
  organizationId: string,
  payload: CreateStorePayload,
): Promise<Store> => {
  try {
    const response = await axiosInstance.post<Store>(
      ApiRoutes.organizations.stores(organizationId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create store. Please try again.");
  }
};

export const updateStore = async (
  id: string,
  payload: UpdateStorePayload,
): Promise<Store> => {
  try {
    const response = await axiosInstance.patch<Store>(
      ApiRoutes.stores.byId(id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update store. Please try again.");
  }
};

export const updateStoreTranslation = async (
  id: string,
  field: StoreTranslatableField,
  payload: UpdateStoreTranslationPayload,
): Promise<Store> => {
  try {
    const response = await axiosInstance.patch<Store>(
      ApiRoutes.stores.translation(id, field),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to save translation. Please try again."),
    );
  }
};

export const deleteStore = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.byId(id));
  } catch {
    throw new Error("Failed to delete store. Please try again.");
  }
};

export const getPublicStore = async (slug: string): Promise<PublicStore> => {
  try {
    const response = await axiosInstance.get<PublicStore>(
      ApiRoutes.public.store(slug),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load store. Please try again.");
  }
};
