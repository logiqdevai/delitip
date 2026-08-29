import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addOrganizationMember,
  listOrganizationMembers,
  removeOrganizationMember,
  updateOrganizationMember,
} from "@/features/organizations/services/organizations.services";
import type {
  AddMemberPayload,
  UpdateMemberPayload,
} from "@/features/organizations/interfaces/organizations.interfaces";
import { toast } from "@/components/ui/toast";

export const organizationMembersQueryKeys = {
  list: (organizationId: string) =>
    ["organization-members", organizationId] as const,
};

export const useOrganizationMembers = (organizationId: string) => {
  return useQuery({
    queryKey: organizationMembersQueryKeys.list(organizationId),
    queryFn: () => listOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });
};

export const useAddOrganizationMember = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddMemberPayload) =>
      addOrganizationMember(organizationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      toast.add({ title: "Member added", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not add member",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useUpdateOrganizationMember = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: UpdateMemberPayload;
    }) => updateOrganizationMember(organizationId, memberId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      toast.add({ title: "Member updated", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not update member",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useRemoveOrganizationMember = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      removeOrganizationMember(organizationId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKeys.list(organizationId),
      });
      toast.add({ title: "Member removed", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not remove member",
        description: error.message,
        type: "error",
      });
    },
  });
};
