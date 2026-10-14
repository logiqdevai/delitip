import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAppConfig,
  getPlatformVatRate,
  updateAppConfig,
} from "@/features/app-config/services/app-config.services";
import type { UpdateAppConfigPayload } from "@/features/app-config/interfaces/app-config.interfaces";
import { toast } from "@/components/ui/toast";

export const appConfigQueryKeys = {
  root: ["app-config"] as const,
  vatRate: ["app-config", "vat-rate"] as const,
};

export const useAppConfig = () => {
  return useQuery({
    queryKey: appConfigQueryKeys.root,
    queryFn: getAppConfig,
  });
};

export const usePlatformVatRate = () => {
  return useQuery({
    queryKey: appConfigQueryKeys.vatRate,
    queryFn: getPlatformVatRate,
  });
};

export const useUpdateAppConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAppConfigPayload) => updateAppConfig(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(appConfigQueryKeys.root, data);
      void queryClient.invalidateQueries({
        queryKey: appConfigQueryKeys.vatRate,
      });
      toast.add({
        title: "App config saved",
        description: "New values apply to future tips and payouts.",
        type: "success",
      });
    },
    onError: () => {
      toast.add({
        title: "Could not save app config",
        description: "Check the values and try again.",
        type: "error",
      });
    },
  });
};
