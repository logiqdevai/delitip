import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPublicTip,
  getTip,
  listEmployeeTips,
  listStoreTips,
} from "@/features/tips/services/tips.services";
import type {
  CreatePublicTipPayload,
  TipsQuery,
} from "@/features/tips/interfaces/tips.interfaces";

export const tipsQueryKeys = {
  root: ["tips"] as const,
  storeList: (storeId: string, query?: TipsQuery) =>
    ["tips", "store", storeId, query] as const,
  employeeList: (employeeId: string, query?: TipsQuery) =>
    ["tips", "employee", employeeId, query] as const,
  detail: (id: string) => ["tip", id] as const,
};

export const useStoreTips = (storeId: string, query?: TipsQuery) => {
  return useQuery({
    queryKey: tipsQueryKeys.storeList(storeId, query),
    queryFn: () => listStoreTips(storeId, query),
    enabled: !!storeId,
  });
};

export const useEmployeeTips = (employeeId: string, query?: TipsQuery) => {
  return useQuery({
    queryKey: tipsQueryKeys.employeeList(employeeId, query),
    queryFn: () => listEmployeeTips(employeeId, query),
    enabled: !!employeeId,
  });
};

export const useTip = (id: string) => {
  return useQuery({
    queryKey: tipsQueryKeys.detail(id),
    queryFn: () => getTip(id),
    enabled: !!id,
  });
};

export const useCreatePublicTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePublicTipPayload) => createPublicTip(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tipsQueryKeys.root });
    },
  });
};
