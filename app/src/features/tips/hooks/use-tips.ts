import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPublicTip,
  getPublicTipStatus,
  getTip,
  listEmployeeTips,
  listStoreTips,
} from "@/features/tips/services/tips.services";
import {
  TipStatuses,
  type CreatePublicTipPayload,
  type TipsQuery,
} from "@/features/tips/interfaces/tips.interfaces";

export const tipsQueryKeys = {
  root: ["tips"] as const,
  storeList: (storeId: string, query?: TipsQuery) =>
    ["tips", "store", storeId, query] as const,
  employeeList: (employeeId: string, query?: TipsQuery) =>
    ["tips", "employee", employeeId, query] as const,
  detail: (id: string) => ["tip", id] as const,
  publicStatus: (id: string) => ["public-tip-status", id] as const,
};

const TIP_STATUS_POLL_INTERVAL_MS = 1500;
const NON_TERMINAL_TIP_STATUSES: string[] = [
  TipStatuses.PENDING,
  TipStatuses.CREATED,
  TipStatuses.PROCESSING,
];

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

// Short-poll for the checkout-return flow: keeps refetching while the tip
// is still CREATED/PROCESSING, stops once it reaches a terminal status.
export const usePublicTipStatus = (tipId: string | null) => {
  return useQuery({
    queryKey: tipsQueryKeys.publicStatus(tipId ?? ""),
    queryFn: () => getPublicTipStatus(tipId!),
    enabled: !!tipId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || NON_TERMINAL_TIP_STATUSES.includes(status)) {
        return TIP_STATUS_POLL_INTERVAL_MS;
      }
      return false;
    },
  });
};
