"use client";

import { type FC, useState } from "react";
import { ImagePlus, KeyRound, LogOut } from "lucide-react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { Button } from "@/components/ui/button";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useCurrentEmployee } from "@/features/employees/hooks/use-employees";
import { Routes } from "@/routes/routes";
import { EmployeeChangePasswordDialog } from "../components/employee-change-password-dialog";
import { EmployeePhotoDialog } from "../components/employee-photo-dialog";

const ProfilePage: FC = () => {
  const { employee, store, isPending } = useCurrentEmployee();
  const logout = useLogout();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <h1 className="text-lg font-extrabold tracking-tight text-ink-charcoal">
        Profile
      </h1>

      <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-4">
          {isPending ? (
            <Skeleton className="size-16 rounded-full" />
          ) : (
            <EmployeeAvatar
              name={employee?.full_name ?? "?"}
              photoUrl={employee?.photo_document?.url}
              className="size-16 text-lg ring-2 ring-electric-lime/20"
            />
          )}
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-ink-charcoal">
              {employee?.full_name ?? "Account"}
            </div>
            <div className="truncate text-xs font-medium text-zinc-400">
              {store?.name ?? "Employee"}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Button
            variant="outline"
            disabled={!employee}
            onClick={() => setPhotoDialogOpen(true)}
          >
            <ImagePlus className="size-4" />
            Edit photo
          </Button>
          <Button
            variant="outline"
            onClick={() => setChangePasswordDialogOpen(true)}
          >
            <KeyRound className="size-4" />
            Change password
          </Button>
        </div>
      </div>

      <AccountSwitcher
        size="default"
        className="w-full max-w-none sm:max-w-none"
      />

      <Button
        variant="outline"
        className="w-full text-red-600"
        onClick={() =>
          logout({ redirectTo: `${Routes.auth.sign_in}?role=employee` })
        }
      >
        <LogOut className="size-4" />
        Log out
      </Button>

      {employee ? (
        <EmployeePhotoDialog
          open={photoDialogOpen}
          onOpenChange={setPhotoDialogOpen}
          employee={employee}
        />
      ) : null}

      <EmployeeChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
