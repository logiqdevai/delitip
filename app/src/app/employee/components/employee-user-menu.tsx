"use client";

import { type FC, useState } from "react";
import {
  ChevronsUpDown,
  ImagePlus,
  KeyRound,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useCurrentEmployee } from "@/features/employees/hooks/use-employees";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { EmployeeChangePasswordDialog } from "./employee-change-password-dialog";
import { EmployeePhotoDialog } from "./employee-photo-dialog";

interface EmployeeUserMenuProps {
  onNavigate?: () => void;
}

export const EmployeeUserMenu: FC<EmployeeUserMenuProps> = ({ onNavigate }) => {
  const { isMobile } = useSidebar();
  const { employee, store } = useCurrentEmployee();
  const logout = useLogout();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const handleLogout = () => {
    onNavigate?.();
    logout({
      redirectTo: `${Routes.auth.sign_in}?role=employee`,
    });
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 text-left outline-none transition hover:bg-neutral-fill focus-visible:ring-2 focus-visible:ring-ring/50 aria-expanded:bg-neutral-fill",
                "group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-neutral-fill",
              )}
              aria-label="Account menu"
            >
              <EmployeeAvatar
                name={employee?.full_name ?? "?"}
                photoUrl={employee?.photo_document?.url}
                size="md"
                className="ring-2 ring-electric-lime/20 group-data-[collapsible=icon]:size-9"
              />
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-bold text-ink-charcoal">
                  {employee?.full_name ?? "Account"}
                </span>
                <span className="truncate text-[10px] font-medium text-zinc-400">
                  {store?.name ?? "Employee"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-zinc-400 group-data-[collapsible=icon]:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-xl border-zinc-200 bg-white p-1 shadow-md"
              side={isMobile ? "bottom" : "top"}
              align="end"
              sideOffset={8}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 text-left">
                    <EmployeeAvatar
                      name={employee?.full_name ?? "?"}
                      photoUrl={employee?.photo_document?.url}
                      size="md"
                      className="ring-2 ring-electric-lime/20"
                    />
                    <div className="grid min-w-0 flex-1 text-left leading-tight">
                      <span className="truncate text-xs font-bold text-ink-charcoal">
                        {employee?.full_name ?? "Account"}
                      </span>
                      <span className="truncate text-[10px] font-medium text-zinc-400">
                        {store?.name ?? "Employee"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem
                className="gap-2 rounded-lg px-2 py-1.5 text-chip font-medium text-zinc-700 focus:bg-neutral-fill focus:text-ink-charcoal"
                disabled={!employee}
                onClick={() => {
                  onNavigate?.();
                  setPhotoDialogOpen(true);
                }}
              >
                <ImagePlus className="size-4 text-zinc-400" />
                Edit photo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 rounded-lg px-2 py-1.5 text-chip font-medium text-zinc-700 focus:bg-neutral-fill focus:text-ink-charcoal"
                onClick={() => {
                  onNavigate?.();
                  setChangePasswordDialogOpen(true);
                }}
              >
                <KeyRound className="size-4 text-zinc-400" />
                Change password
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem
                variant="destructive"
                className="gap-2 rounded-lg px-2 py-1.5 text-chip font-medium"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

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
    </>
  );
};
