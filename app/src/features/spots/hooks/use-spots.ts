import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSpot,
  deleteSpot,
  listSpots,
  updateSpot,
} from "@/features/spots/services/spots.services";
import type {
  CreateSpotPayload,
  SpotsQuery,
  UpdateSpotPayload,
} from "@/features/spots/interfaces/spots.interfaces";
import { toast } from "@/components/ui/toast";

export const spotsQueryKeys = {
  root: ["spots"] as const,
  list: (storeId: string, query?: SpotsQuery) =>
    ["spots", storeId, query] as const,
};

export const useSpots = (storeId: string, query?: SpotsQuery) => {
  return useQuery({
    queryKey: spotsQueryKeys.list(storeId, query),
    queryFn: () => listSpots(storeId, query),
    enabled: !!storeId,
  });
};

export const useCreateSpot = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpotPayload) => createSpot(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      toast.add({ title: "Spot created", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not create spot",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateSpot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSpotPayload }) =>
      updateSpot(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      toast.add({ title: "Spot updated", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update spot",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteSpot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSpot(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      toast.add({ title: "Spot removed", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not remove spot",
        description: error.message,
        type: "error",
      });
    },
  });
};
