import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  getOrganization,
  listMyOrganizations,
} from "@/features/organizations/services/organizations.services";
import type { CreateOrganizationPayload } from "@/features/organizations/interfaces/organizations.interfaces";
import {
  createStore,
  updateStore,
} from "@/features/stores/services/stores.services";
import type { BusinessSetupFormData } from "@/features/stores/validation-schemas/stores.schema";
import { storesQueryKeys } from "@/features/stores/hooks/use-stores";
import { usersQueryKeys } from "@/features/users/hooks/use-users";
import { toast } from "@/components/ui/toast";

export const organizationsQueryKeys = {
  root: ["organizations"] as const,
  mine: ["organizations", "mine"] as const,
  detail: (id: string) => ["organizations", id] as const,
};

export type BusinessSetupContext = {
  organizationId?: string;
  storeId?: string;
};

export const useMyOrganizations = (enabled = true) => {
  return useQuery({
    queryKey: organizationsQueryKeys.mine,
    queryFn: listMyOrganizations,
    enabled,
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: organizationsQueryKeys.detail(id),
    queryFn: () => getOrganization(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      createOrganization(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.accounts });
    },
  });
};

export const useCompleteBusinessSetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      values,
      context,
    }: {
      values: BusinessSetupFormData;
      context: BusinessSetupContext;
    }) => {
      const storeFields = {
        name: values.name,
        industry: values.industry,
        timezone: values.timezone,
        currency: values.currency,
        address_line: values.address_line || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        postal_code: values.postal_code || undefined,
        full_address: values.full_address,
      };

      if (context.storeId) {
        return updateStore(context.storeId, storeFields);
      }

      if (context.organizationId) {
        return createStore(context.organizationId, storeFields);
      }

      const organization = await createOrganization({
        name: values.name,
        store: {
          name: values.name,
          industry: values.industry,
        },
      });

      if (organization.store?.id) {
        return updateStore(organization.store.id, {
          timezone: values.timezone,
          currency: values.currency,
          address_line: values.address_line || undefined,
          city: values.city || undefined,
          country: values.country || undefined,
          postal_code: values.postal_code || undefined,
          full_address: values.full_address,
        });
      }

      return organization;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.root,
      });
      void queryClient.invalidateQueries({ queryKey: storesQueryKeys.root });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.accounts });
      toast.add({
        title: "Business profile ready",
        description: "You can continue setup from your dashboard.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not save business profile",
        description: error.message,
        type: "error",
      });
    },
  });
};
