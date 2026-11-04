import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AddMemberPayload,
  CreateOrganizationPayload,
  Organization,
  OrganizationMembership,
  OrganizationMemberWithRefs,
  UpdateMemberPayload,
  UpdateOrganizationPayload,
} from "@/features/organizations/interfaces/organizations.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

export type OrganizationWithStore = Organization & {
  store?: Store | null;
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
        "We couldn't create your business. Please try again.",
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
        "We couldn't load organizations. Please try again.",
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
        "We couldn't load organization. Please try again.",
      ),
    );
  }
};

export const updateOrganization = async (
  id: string,
  payload: UpdateOrganizationPayload,
): Promise<Organization> => {
  try {
    const response = await axiosInstance.patch<Organization>(
      ApiRoutes.organizations.byId(id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "We couldn't update organization. Please try again.",
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
      getApiErrorMessage(error, "We couldn't load members. Please try again."),
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
      getApiErrorMessage(error, "We couldn't add member. Please try again."),
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
      getApiErrorMessage(error, "We couldn't update member. Please try again."),
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
      getApiErrorMessage(error, "We couldn't remove member. Please try again."),
    );
  }
};
