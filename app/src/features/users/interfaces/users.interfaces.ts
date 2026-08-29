import type {
  Organization,
  OrganizationRole,
} from "@/features/organizations/interfaces/organizations.interfaces";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

export interface UserProfile {
  id: string;
  email?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface UserOrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  store_id?: string | null;
  created_at: string;
  updated_at: string;
  organization: Organization;
  store?: Store | null;
}

export interface UserEmployeeAccount extends Employee {
  store: Store;
}

export interface UserAccounts {
  organization_memberships: UserOrganizationMembership[];
  employee_accounts: UserEmployeeAccount[];
  has_customer_account: boolean;
}
