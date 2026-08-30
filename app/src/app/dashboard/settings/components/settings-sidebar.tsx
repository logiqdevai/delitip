"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { settingsNavItems } from "./settings-nav-items";

export const SettingsSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs md:hidden">
        <nav className="flex gap-1 overflow-x-auto">
          {settingsNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-chip transition",
                  active
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-electric-lime" : "text-zinc-400",
                  )}
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Sidebar
        collapsible="none"
        className="sticky top-6 hidden h-auto w-64 shrink-0 self-start bg-transparent md:flex"
      >
        <SidebarContent className="gap-0 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {settingsNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        render={<Link href={item.href} />}
                        className={cn(
                          "h-auto gap-3 rounded-xl px-3 py-2 text-chip",
                          active
                            ? "bg-brand-50 font-semibold text-brand-800"
                            : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            active ? "text-electric-lime" : "text-zinc-400",
                          )}
                          strokeWidth={2}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};
