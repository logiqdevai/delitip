"use client";

import { type FC } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
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
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useMe } from "@/features/users/hooks/use-users";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

const displayNameFromProfile = (profile: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) => {
  const name = [profile.first_name, profile.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  return name || profile.email?.trim() || "Account";
};

const initialsFromProfile = (profile: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) => {
  const first = profile.first_name?.trim()?.charAt(0);
  const last = profile.last_name?.trim()?.charAt(0);
  if (first && last) return `${first}${last}`.toUpperCase();
  if (first) return first.toUpperCase();
  const email = profile.email?.trim();
  if (email) return email.charAt(0).toUpperCase();
  return "?";
};

const UserAvatar: FC<{ initials: string }> = ({ initials }) => (
  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-charcoal text-[10px] font-bold tracking-wide text-paper-offwhite group-data-[collapsible=icon]:size-9">
    {initials}
  </div>
);

interface DashboardUserMenuProps {
  onNavigate?: () => void;
}

export const DashboardUserMenu: FC<DashboardUserMenuProps> = ({
  onNavigate,
}) => {
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe(!!authUser);

  const profile = meQuery.data ?? {
    first_name: null,
    last_name: null,
    email: authUser?.email ?? null,
  };
  const displayName = displayNameFromProfile(profile);
  const email = profile.email?.trim() || authUser?.email || "";
  const initials = initialsFromProfile(profile);

  const handleLogout = () => {
    onNavigate?.();
    logout();
  };

  if (meQuery.isPending && !authUser?.email) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50 p-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-32" />
        </div>
      </div>
    );
  }

  return (
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
            <UserAvatar initials={initials} />
            <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-bold text-ink-charcoal">
                {displayName}
              </span>
              <span className="truncate text-[10px] font-medium text-zinc-400">
                {email || "—"}
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
                  <UserAvatar initials={initials} />
                  <div className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="truncate text-xs font-bold text-ink-charcoal">
                      {displayName}
                    </span>
                    <span className="truncate text-[10px] font-medium text-zinc-400">
                      {email || "—"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-2 rounded-lg px-2 py-1.5 text-chip font-medium text-zinc-700 focus:bg-neutral-fill focus:text-ink-charcoal"
                render={
                  <Link
                    href={Routes.dashboard.account}
                    onClick={onNavigate}
                  />
                }
              >
                <BadgeCheck className="size-4 text-zinc-400" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hidden gap-2 rounded-lg px-2 py-1.5 text-chip font-medium text-zinc-700 focus:bg-neutral-fill focus:text-ink-charcoal"
                render={
                  <Link
                    href={Routes.dashboard.settings.billing}
                    onClick={onNavigate}
                  />
                }
              >
                <CreditCard className="size-4 text-zinc-400" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
  );
};
