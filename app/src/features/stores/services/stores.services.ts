import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AdminStoreOption,
  CreateStorePayload,
  PublicStore,
  Store,
  UpdateStorePayload,
} from "@/features/stores/interfaces/stores.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const listAdminStores = async (): Promise<AdminStoreOption[]> => {
  try {
    const response = await axiosInstance.get<AdminStoreOption[]>(
      ApiRoutes.admin.stores,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't load stores. Please try again."));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't load stores. Please try again."));
  }
};

export const getStore = async (id: string): Promise<Store> => {
  try {
    const response = await axiosInstance.get<Store>(ApiRoutes.stores.byId(id));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't load store. Please try again."));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't create store. Please try again."));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't update store. Please try again."));
  }
};

export const deleteStore = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.byId(id));
  } catch (error) {
    // Surface the API's reason (last store, or a store with tips/reviews).
    throw new Error(
      getErrorMessage(error, "We couldn't delete this store. Please try again."),
    );
  }
};

export const getPublicStore = async (
  slug: string,
  lang?: string,
): Promise<PublicStore> => {
  try {
    const response = await axiosInstance.get<PublicStore>(
      ApiRoutes.public.store(slug),
      { params: lang ? { lang } : undefined },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "We couldn't load store. Please try again."));
  }
};
