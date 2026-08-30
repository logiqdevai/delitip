import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStore,
  deleteStore,
  getPublicStore,
  getStore,
  listStores,
  updateStore,
} from "@/features/stores/services/stores.services";
import type {
  CreateStorePayload,
  UpdateStorePayload,
} from "@/features/stores/interfaces/stores.interfaces";
import { toast } from "@/components/ui/toast";
import { usersQueryKeys } from "@/features/users/hooks/use-users";

const organizationsRootKey = ["organizations"] as const;

export const storesQueryKeys = {
  root: ["stores"] as const,
  list: (organizationId: string) => ["stores", organizationId] as const,
  // Nested under the same "stores" root (not a separate "store" key) so that
  // invalidating storesQueryKeys.root also refetches any open detail query —
  // several settings forms (e.g. Branding) read logo/cover refs from here.
  detail: (id: string) => ["stores", "detail", id] as const,
  public: (slug: string) => ["public-store", slug] as const,
};

export const useStores = (organizationId: string) => {
  return useQuery({
    queryKey: storesQueryKeys.list(organizationId),
    queryFn: () => listStores(organizationId),
    enabled: !!organizationId,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: storesQueryKeys.detail(id),
    queryFn: () => getStore(id),
    enabled: !!id,
  });
};

export const usePublicStore = (slug: string) => {
  return useQuery({
    queryKey: storesQueryKeys.public(slug),
    queryFn: () => getPublicStore(slug),
    enabled: !!slug,
  });
};

export const useCreateStore = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStorePayload) =>
      createStore(organizationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: organizationsRootKey,
      });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.accounts,
      });
      toast.add({
        title: "Store created",
        description: "Your store was added successfully.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not create store",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStorePayload }) =>
      updateStore(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: organizationsRootKey,
      });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.accounts,
      });
      toast.add({
        title: "Store updated",
        description: "Your changes were saved.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update store",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: organizationsRootKey,
      });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.accounts,
      });
      toast.add({
        title: "Store deleted",
        description: "The store was removed.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not delete store",
        description: error.message,
        type: "error",
      });
    },
  });
};
