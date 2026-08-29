"use client";

import { type FC, type FormEvent, useState } from "react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useAddOrganizationMember } from "@/features/organizations/hooks/use-organization-members";
import { OrganizationRoles } from "@/features/organizations/interfaces/organizations.interfaces";
import { OrganizationRoleFormOptions } from "@/config/constants/dropdowns/organizations/organization-role-form.options";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  stores: Store[];
}

export const InviteMemberDialog: FC<InviteMemberDialogProps> = ({
  open,
  onOpenChange,
  organizationId,
  stores,
}) => {
  const addMember = useAddOrganizationMember(organizationId);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(OrganizationRoles.STORE_MANAGER);
  const [storeId, setStoreId] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMember.mutate(
      {
        email: email.trim(),
        role: role as (typeof OrganizationRoles)[keyof typeof OrganizationRoles],
        store_id: storeId || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setEmail("");
          setStoreId("");
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (addMember.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent showCloseButton={!addMember.isPending}>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            They&apos;ll get access next time they sign in with this email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <NativeSelect
              id="invite-role"
              className="w-full"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {OrganizationRoleFormOptions.map((option) => (
                <NativeSelectOption key={option.id} value={option.id}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-store">
              Store scope{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <NativeSelect
              id="invite-store"
              className="w-full"
              value={storeId}
              onChange={(event) => setStoreId(event.target.value)}
            >
              <NativeSelectOption value="">
                Organization-wide
              </NativeSelectOption>
              {stores.map((store) => (
                <NativeSelectOption key={store.id} value={store.id}>
                  {store.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={addMember.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={addMember.isPending}>
              Invite
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
