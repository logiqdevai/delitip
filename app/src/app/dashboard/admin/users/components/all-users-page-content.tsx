"use client";

import { type FC, useState } from "react";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { getUserPlatformRoleLabel } from "@/config/constants/dropdowns/users/user-platform-role-form.options";
import { useUsers } from "@/features/users/hooks/use-users";
import type { UserProfile } from "@/features/users/interfaces/users.interfaces";
import { cn } from "@/lib/utils";

const roleChipClass: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700",
  ADMIN: "bg-brand-50 text-brand-700",
  SUPPORT: "bg-sky-50 text-sky-700",
  USER: "bg-neutral-fill text-zinc-600",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

const userDisplayName = (user: UserProfile) => {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || "-";
};

const PAGE_LIMIT = 20;

export const AllUsersPageContent: FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const usersQuery = useUsers({
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
  });

  const users = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;

  return (
    <>
      <DashboardPageHeader
        title="All Users"
        description="Every account registered on delitip, across all businesses."
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-400" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email"
          aria-label="Search users"
          className="rounded-xl border-zinc-200 bg-white pl-9 font-medium text-ink-charcoal shadow-xs"
        />
      </div>

      {usersQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : usersQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load users</EmptyTitle>
            <EmptyDescription>{usersQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void usersQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : users.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>
              {search
                ? "No users match your search."
                : "No one has signed up yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Name</TableHead>
                  <TableHead className="px-4">Email</TableHead>
                  <TableHead className="px-4">Phone</TableHead>
                  <TableHead className="px-4">Role</TableHead>
                  <TableHead className="px-4 text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {userDisplayName(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {user.email ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {user.phone ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          roleChipClass[user.role ?? "USER"] ??
                            roleChipClass.USER,
                        )}
                      >
                        {getUserPlatformRoleLabel(user.role)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right text-zinc-500">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                {pagination.total} user{pagination.total === 1 ? "" : "s"}{" "}
                total - page {pagination.page} of{" "}
                {Math.max(pagination.total_pages, 1)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
