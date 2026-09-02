import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AdminStoreOption,
  CreateStorePayload,
  PublicStore,
  Store,
  UpdateStorePayload,
} from "@/features/stores/interfaces/stores.interfaces";

export const listAdminStores = async (): Promise<AdminStoreOption[]> => {
  try {
    const response = await axiosInstance.get<AdminStoreOption[]>(
      ApiRoutes.admin.stores,
    );
    return response.data;
  } catch {
    throw new Error("Failed to load stores. Please try again.");
  }
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
