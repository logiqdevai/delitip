import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreateEmployeePayload,
  Employee,
  EmployeeDashboard,
  EmployeesQuery,
  UpdateEmployeePayload,
} from "@/features/employees/interfaces/employees.interfaces";

export const listEmployees = async (
  storeId: string,
  query?: EmployeesQuery,
): Promise<PaginatedResponse<Employee>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Employee>>(
      ApiRoutes.stores.employees(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load employees. Please try again.");
  }
};

export const getEmployee = async (id: string): Promise<Employee> => {
  try {
    const response = await axiosInstance.get<Employee>(
      ApiRoutes.employees.byId(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load employee. Please try again.");
  }
};

export const createEmployee = async (
  storeId: string,
  payload: CreateEmployeePayload,
): Promise<Employee> => {
  try {
    const response = await axiosInstance.post<Employee>(
      ApiRoutes.stores.employees(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create employee. Please try again.");
  }
};

export const updateEmployee = async (
  id: string,
  payload: UpdateEmployeePayload,
): Promise<Employee> => {
  try {
    const response = await axiosInstance.patch<Employee>(
      ApiRoutes.employees.byId(id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update employee. Please try again.");
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.employees.byId(id));
  } catch {
    throw new Error("Failed to delete employee. Please try again.");
  }
};

export const getEmployeeDashboard = async (
  id: string,
): Promise<EmployeeDashboard> => {
  try {
    const response = await axiosInstance.get<EmployeeDashboard>(
      ApiRoutes.employees.dashboard(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load employee dashboard. Please try again.");
  }
};
