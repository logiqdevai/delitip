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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            <Select
              items={OrganizationRoleFormOptions.map((option) => ({
                label: option.label,
                value: option.id,
              }))}
              value={role}
              onValueChange={(value) => {
                if (value) setRole(value);
              }}
            >
              <SelectTrigger id="invite-role" className="w-full">
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
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-store">
              Store scope{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Select
              items={[
                { label: "Organization-wide", value: "" },
                ...stores.map((store) => ({
                  label: store.name,
                  value: store.id,
                })),
              ]}
              value={storeId}
              onValueChange={(value) => setStoreId(value ?? "")}
            >
              <SelectTrigger id="invite-store" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">Organization-wide</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
