import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateInsight,
  getAdminOverview,
  getAdminTrends,
  getDashboardOverview,
  getDashboardTrends,
  getEmployeesPerformance,
  getExperienceScore,
  getStoreTipsAnalytics,
  getStoresPerformance,
  listInsights,
} from "@/features/analytics/services/analytics.services";
import type {
  AdminOverviewQuery,
  AdminTrendsQuery,
  DashboardQuery,
  GenerateInsightPayload,
  PeriodQuery,
  StoreTipsAnalyticsQuery,
  TrendsQuery,
} from "@/features/analytics/interfaces/analytics.interfaces";
import { toast } from "@/components/ui/toast";

export const analyticsQueryKeys = {
  overview: (organizationId: string, query?: DashboardQuery) =>
    ["analytics", "overview", organizationId, query] as const,
  trends: (organizationId: string, query?: TrendsQuery) =>
    ["analytics", "trends", organizationId, query] as const,
  employeesPerformance: (organizationId: string, query?: DashboardQuery) =>
    ["analytics", "employees-performance", organizationId, query] as const,
  storesPerformance: (organizationId: string, query?: PeriodQuery) =>
    ["analytics", "stores-performance", organizationId, query] as const,
  experienceScore: (organizationId: string, query?: DashboardQuery) =>
    ["analytics", "experience-score", organizationId, query] as const,
  storeTips: (storeId: string, query?: StoreTipsAnalyticsQuery) =>
    ["analytics", "store-tips", storeId, query] as const,
  insights: (storeId: string) => ["insights", storeId] as const,
  adminOverview: (query?: AdminOverviewQuery) =>
    ["analytics", "admin-overview", query] as const,
  adminTrends: (query?: AdminTrendsQuery) =>
    ["analytics", "admin-trends", query] as const,
};

export const useDashboardOverview = (
  organizationId: string,
  query?: DashboardQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.overview(organizationId, query),
    queryFn: () => getDashboardOverview(organizationId, query),
    enabled: !!organizationId,
  });
};

export const useDashboardTrends = (
  organizationId: string,
  query?: TrendsQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.trends(organizationId, query),
    queryFn: () => getDashboardTrends(organizationId, query),
    enabled: !!organizationId,
  });
};

export const useEmployeesPerformance = (
  organizationId: string,
  query?: DashboardQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.employeesPerformance(organizationId, query),
    queryFn: () => getEmployeesPerformance(organizationId, query),
    enabled: !!organizationId,
  });
};

export const useStoresPerformance = (
  organizationId: string,
  query?: PeriodQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.storesPerformance(organizationId, query),
    queryFn: () => getStoresPerformance(organizationId, query),
    enabled: !!organizationId,
  });
};

export const useExperienceScore = (
  organizationId: string,
  query?: DashboardQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.experienceScore(organizationId, query),
    queryFn: () => getExperienceScore(organizationId, query),
    enabled: !!organizationId,
  });
};

export const useStoreTipsAnalytics = (
  storeId: string,
  query?: StoreTipsAnalyticsQuery,
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.storeTips(storeId, query),
    queryFn: () => getStoreTipsAnalytics(storeId, query),
    enabled: !!storeId,
  });
};

export const useAdminOverview = (query?: AdminOverviewQuery) => {
  return useQuery({
    queryKey: analyticsQueryKeys.adminOverview(query),
    queryFn: () => getAdminOverview(query),
  });
};

export const useAdminTrends = (query?: AdminTrendsQuery) => {
  return useQuery({
    queryKey: analyticsQueryKeys.adminTrends(query),
    queryFn: () => getAdminTrends(query),
  });
};

export const useInsights = (storeId: string) => {
  return useQuery({
    queryKey: analyticsQueryKeys.insights(storeId),
    queryFn: () => listInsights(storeId, { limit: 20 }),
    enabled: !!storeId,
  });
};

export const useGenerateInsight = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateInsightPayload) =>
      generateInsight(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: analyticsQueryKeys.insights(storeId),
      });
      toast.add({
        title: "Insight generated",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not generate insight",
        description: error.message,
        type: "error",
      });
    },
  });
};
