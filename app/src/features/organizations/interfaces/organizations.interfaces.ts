import type {
  Store,
  StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";

export const OrganizationRoles = {
  OWNER: "OWNER",
  STORE_MANAGER: "STORE_MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
} as const;
export type OrganizationRole =
  (typeof OrganizationRoles)[keyof typeof OrganizationRoles];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  logo_document_id?: string | null;
  vat_number?: string | null;
  legal_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  is_active?: boolean;
  logo_document_id?: string;
  vat_number?: string;
  legal_name?: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  store_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInitialStorePayload {
  name: string;
  industry: StoreIndustry;
}

export interface CreateOrganizationPayload {
  name: string;
  store?: CreateInitialStorePayload;
}

export interface OrganizationMembership {
  role: OrganizationRole;
  organization: Organization & {
    stores?: Store[];
  };
}

export interface OrganizationMemberUserRef {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export interface OrganizationMemberWithRefs extends OrganizationMember {
  user?: OrganizationMemberUserRef | null;
  store?: Store | null;
}

export interface AddMemberPayload {
  email: string;
  role: OrganizationRole;
  store_id?: string;
  first_name?: string;
  last_name?: string;
}

export interface UpdateMemberPayload {
  role?: OrganizationRole;
  store_id?: string | null;
}
