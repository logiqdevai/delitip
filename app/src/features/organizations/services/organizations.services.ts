import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AddMemberPayload,
  CreateOrganizationPayload,
  Organization,
  OrganizationMembership,
  OrganizationMemberWithRefs,
  UpdateMemberPayload,
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

export const listOrganizationMembers = async (
  organizationId: string,
): Promise<OrganizationMemberWithRefs[]> => {
  try {
    const response = await axiosInstance.get<OrganizationMemberWithRefs[]>(
      ApiRoutes.organizations.members(organizationId),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load members. Please try again."),
    );
  }
};

export const addOrganizationMember = async (
  organizationId: string,
  payload: AddMemberPayload,
): Promise<OrganizationMemberWithRefs> => {
  try {
    const response = await axiosInstance.post<OrganizationMemberWithRefs>(
      ApiRoutes.organizations.members(organizationId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to add member. Please try again."),
    );
  }
};

export const updateOrganizationMember = async (
  organizationId: string,
  memberId: string,
  payload: UpdateMemberPayload,
): Promise<OrganizationMemberWithRefs> => {
  try {
    const response = await axiosInstance.patch<OrganizationMemberWithRefs>(
      ApiRoutes.organizations.member(organizationId, memberId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update member. Please try again."),
    );
  }
};

export const removeOrganizationMember = async (
  organizationId: string,
  memberId: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(
      ApiRoutes.organizations.member(organizationId, memberId),
    );
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to remove member. Please try again."),
    );
  }
};
