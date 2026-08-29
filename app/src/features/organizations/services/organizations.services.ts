import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationMembership,
} from "@/features/organizations/interfaces/organizations.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

export type OrganizationWithStore = Organization & {
  store?: Store | null;
};

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

export const createOrganization = async (
  payload: CreateOrganizationPayload,
): Promise<OrganizationWithStore> => {
  try {
    const response = await axiosInstance.post<OrganizationWithStore>(
      ApiRoutes.organizations.prefix,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to create your business. Please try again.",
      ),
    );
  }
};

export const listMyOrganizations = async (): Promise<
  OrganizationMembership[]
> => {
  try {
    const response = await axiosInstance.get<OrganizationMembership[]>(
      ApiRoutes.organizations.prefix,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to load organizations. Please try again.",
      ),
    );
  }
};

export const getOrganization = async (id: string): Promise<Organization> => {
  try {
    const response = await axiosInstance.get<Organization>(
      ApiRoutes.organizations.byId(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to load organization. Please try again.",
      ),
    );
  }
};
