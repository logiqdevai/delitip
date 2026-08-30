"use client";

import { type FC, useState } from "react";
import { Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import {
  useOrganizationMembers,
  useRemoveOrganizationMember,
  useUpdateOrganizationMember,
} from "@/features/organizations/hooks/use-organization-members";
import type { OrganizationMemberWithRefs } from "@/features/organizations/interfaces/organizations.interfaces";
import { OrganizationRoleFormOptions, getOrganizationRoleLabel } from "@/config/constants/dropdowns/organizations/organization-role-form.options";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStores } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const MembersSettingsPanel: FC = () => {
  const { organizationId, role: currentUserRole } = useWorkspace();
  const membersQuery = useOrganizationMembers(organizationId ?? "");
  const storesQuery = useStores(organizationId ?? "");
  const updateMember = useUpdateOrganizationMember(organizationId ?? "");
  const removeMember = useRemoveOrganizationMember(organizationId ?? "");
  const removeConfirm = useConfirmationDialog();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<OrganizationMemberWithRefs | null>(null);

  const isOwner = currentUserRole === "OWNER";
  const members = membersQuery.data ?? [];
  const stores = storesQuery.data ?? [];

  if (!organizationId) return null;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users2 className="size-4 text-zinc-400" strokeWidth={2} />
          <h2 className="text-sm font-bold text-ink-charcoal">
            Members & access
          </h2>
        </div>
        {isOwner ? (
          <Button
            type="button"
            size="sm"
            onClick={() => setInviteOpen(true)}
            className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
          >
            Invite member
          </Button>
        ) : null}
      </div>

      {membersQuery.isPending ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : membersQuery.isError ? (
        <p className="text-xs text-red-600">{membersQuery.error.message}</p>
      ) : members.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
          No members yet.
        </p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <div className="font-semibold text-ink-charcoal">
                  {member.user?.first_name || member.user?.last_name
                    ? `${member.user?.first_name ?? ""} ${member.user?.last_name ?? ""}`.trim()
                    : (member.user?.email ?? "Unknown")}
                </div>
                <div className="text-xs text-zinc-400">
                  {member.user?.email}
                  {member.store ? ` · ${member.store.name}` : " · Organization-wide"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner ? (
                  <Select
                    items={OrganizationRoleFormOptions.map((option) => ({
                      label: option.label,
                      value: option.id,
                    }))}
                    value={member.role}
                    onValueChange={(value) => {
                      if (value) {
                        updateMember.mutate({
                          memberId: member.id,
                          payload: { role: value as typeof member.role },
                        });
                      }
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {OrganizationRoleFormOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="rounded-full bg-neutral-fill px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                    {getOrganizationRoleLabel(member.role)}
                  </span>
                )}
                {isOwner ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPendingRemove(member);
                      removeConfirm.openDialog();
                    }}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOwner ? (
        <InviteMemberDialog
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          organizationId={organizationId}
          stores={stores}
        />
      ) : null}

      <ConfirmationDialog
        state={{
          ...removeConfirm,
          onOpenChange: (open) => {
            removeConfirm.onOpenChange(open);
            if (!open) setPendingRemove(null);
          },
        }}
        title="Remove this member?"
        description={
          pendingRemove
            ? `${pendingRemove.user?.email ?? "This member"} will lose access to this organization.`
            : "This member will be removed."
        }
        confirmLabel="Remove"
        isPending={removeMember.isPending}
        onConfirm={async () => {
          if (!pendingRemove) return;
          await removeMember.mutateAsync(pendingRemove.id);
          setPendingRemove(null);
        }}
      />
    </div>
  );
};
