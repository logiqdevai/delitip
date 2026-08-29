import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDistributionRule,
  deleteDistributionRule,
  getDistributionRule,
  listDistributionRules,
  setDefaultDistributionRule,
  updateDistributionRule,
} from "@/features/distribution/services/distribution.services";
import type {
  CreateDistributionRulePayload,
  SetDefaultDistributionRulePayload,
  UpdateDistributionRulePayload,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { storesQueryKeys } from "@/features/stores/hooks/use-stores";
import { usersQueryKeys } from "@/features/users/hooks/use-users";
import { toast } from "@/components/ui/toast";

export const distributionQueryKeys = {
  root: ["distribution-rules"] as const,
  list: (storeId: string) => ["distribution-rules", storeId] as const,
  detail: (id: string) => ["distribution-rule", id] as const,
};

export const useDistributionRules = (storeId: string) => {
  return useQuery({
    queryKey: distributionQueryKeys.list(storeId),
    queryFn: () => listDistributionRules(storeId),
    enabled: !!storeId,
  });
};

export const useDistributionRule = (id: string) => {
  return useQuery({
    queryKey: distributionQueryKeys.detail(id),
    queryFn: () => getDistributionRule(id),
    enabled: !!id,
  });
};

export const useCreateDistributionRule = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDistributionRulePayload) =>
      createDistributionRule(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      toast.add({
        title: "Distribution rule created",
        description: "It can be set as the store default or assigned to QR codes.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not create rule",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateDistributionRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDistributionRulePayload;
    }) => updateDistributionRule(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.detail(variables.id),
      });
      toast.add({
        title: "Distribution rule updated",
        description: "Future tips will use the new split.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update rule",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteDistributionRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDistributionRule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      toast.add({
        title: "Distribution rule deleted",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not delete rule",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useSetDefaultDistributionRule = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetDefaultDistributionRulePayload) =>
      setDefaultDistributionRule(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: distributionQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.accounts });
      toast.add({
        title: "Default rule updated",
        description: "New tips will use this rule unless a QR overrides it.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not set default rule",
        description: error.message,
        type: "error",
      });
    },
  });
};
