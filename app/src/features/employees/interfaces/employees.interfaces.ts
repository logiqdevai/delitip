export interface Employee {
  id: string;
  store_id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  photo_document_id?: string | null;
  position?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  full_name: string;
  email: string;
  position?: string;
  photo_document_id?: string;
}

export interface UpdateEmployeePayload {
  full_name?: string;
  email?: string;
  position?: string;
  photo_document_id?: string;
  is_active?: boolean;
}

export interface EmployeesQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}
