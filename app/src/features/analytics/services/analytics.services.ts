import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  DashboardOverview,
  DashboardQuery,
  EmployeePerformance,
  ExperienceScore,
  GenerateInsightPayload,
  InsightSummary,
  PeriodQuery,
  StorePerformance,
  StoreTipsAnalytics,
  StoreTipsAnalyticsQuery,
  TrendPoint,
  TrendsQuery,
} from "@/features/analytics/interfaces/analytics.interfaces";

const FAILED = "Failed to load analytics. Please try again.";

export const getDashboardOverview = async (
  organizationId: string,
  query?: DashboardQuery,
): Promise<DashboardOverview> => {
  try {
    const response = await axiosInstance.get<DashboardOverview>(
      ApiRoutes.organizations.dashboard.overview(organizationId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const getDashboardTrends = async (
  organizationId: string,
  query?: TrendsQuery,
): Promise<TrendPoint[]> => {
  try {
    const response = await axiosInstance.get<TrendPoint[]>(
      ApiRoutes.organizations.dashboard.trends(organizationId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const getEmployeesPerformance = async (
  organizationId: string,
  query?: DashboardQuery,
): Promise<EmployeePerformance[]> => {
  try {
    const response = await axiosInstance.get<EmployeePerformance[]>(
      ApiRoutes.organizations.dashboard.employeesPerformance(organizationId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const getStoresPerformance = async (
  organizationId: string,
  query?: PeriodQuery,
): Promise<StorePerformance[]> => {
  try {
    const response = await axiosInstance.get<StorePerformance[]>(
      ApiRoutes.organizations.dashboard.storesPerformance(organizationId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const getExperienceScore = async (
  organizationId: string,
  query?: DashboardQuery,
): Promise<ExperienceScore> => {
  try {
    const response = await axiosInstance.get<ExperienceScore>(
      ApiRoutes.organizations.dashboard.experienceScore(organizationId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const getStoreTipsAnalytics = async (
  storeId: string,
  query?: StoreTipsAnalyticsQuery,
): Promise<StoreTipsAnalytics> => {
  try {
    const response = await axiosInstance.get<StoreTipsAnalytics>(
      ApiRoutes.stores.analyticsTips(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const listInsights = async (
  storeId: string,
  query?: { page?: number; limit?: number },
): Promise<PaginatedResponse<InsightSummary>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<InsightSummary>>(
      ApiRoutes.stores.insights(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error(FAILED);
  }
};

export const generateInsight = async (
  storeId: string,
  payload: GenerateInsightPayload,
): Promise<InsightSummary> => {
  try {
    const response = await axiosInstance.post<InsightSummary>(
      ApiRoutes.stores.insightsGenerate(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to generate insight. Please try again.");
  }
};
