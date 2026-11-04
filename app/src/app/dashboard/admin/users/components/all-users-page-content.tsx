"use client";

import { type FC, useState } from "react";
import { Search, Trash2, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
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
import { UserPlatformRoleFormOptions } from "@/config/constants/dropdowns/users/user-platform-role-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import {
  useDeleteUser,
  useMe,
  useUsers,
} from "@/features/users/hooks/use-users";
import type { UserProfile } from "@/features/users/interfaces/users.interfaces";
import { usePlatformRole } from "@/hooks/use-platform-role";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api-error";

const roleChipClass: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700",
  ADMIN: "bg-brand-50 text-brand-700",
  SUPPORT: "bg-sky-50 text-sky-700",
  USER: "bg-neutral-fill text-zinc-600",
};

const userDisplayName = (user: UserProfile) => {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || "-";
};

const PAGE_LIMIT = 20;

export const AllUsersPageContent: FC = () => {
  const t = useTranslations("dashboard.admin.users");
  const tc = useTranslations("dashboard.admin.common");
  const format = useFormatter();
  const roleLabel = useDropdownLabel();
  const formatDate = (value: string) =>
    format.dateTime(new Date(value), { dateStyle: "medium" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const deleteConfirm = useConfirmationDialog();
  const deleteUser = useDeleteUser();
  const meQuery = useMe();
  const { role: myRole } = usePlatformRole();

  // Mirrors the API rules: never yourself or a super admin, and only a super
  // admin may delete an admin.
  const canDelete = (user: UserProfile) =>
    user.id !== meQuery.data?.id &&
    user.role !== PlatformAuthRoles.SUPER_ADMIN &&
    (user.role !== PlatformAuthRoles.ADMIN ||
      myRole === PlatformAuthRoles.SUPER_ADMIN);

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
        title={t("title")}
        description={t("description")}
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-400" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchAria")}
          className="rounded-xl border-zinc-200 bg-white pl-9 font-medium text-ink-charcoal shadow-xs"
        />
      </div>

      {usersQuery.isPending ? (
        <TableSkeleton columns={6} />
      ) : usersQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyTitle>{t("loadError")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(usersQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void usersQuery.refetch()}
            >
              {tc("tryAgain")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : users.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {search
                ? t("emptyFiltered")
                : t("emptyNone")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">{t("columns.name")}</TableHead>
                  <TableHead className="px-4">{t("columns.email")}</TableHead>
                  <TableHead className="px-4">{t("columns.phone")}</TableHead>
                  <TableHead className="px-4">{t("columns.role")}</TableHead>
                  <TableHead className="px-4 text-right">{t("columns.joined")}</TableHead>
                  <TableHead className="w-12 px-4">
                    <span className="sr-only">{t("columns.actions")}</span>
                  </TableHead>
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
                        {roleLabel(UserPlatformRoleFormOptions, user.role ?? "USER")}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right text-zinc-500">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      {canDelete(user) ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("deleteAria", { name: userDisplayName(user) })}
                          className="text-zinc-400 hover:text-destructive"
                          onClick={() => {
                            setUserToDelete(user);
                            deleteConfirm.openDialog();
                          }}
                        >
                          <Trash2 />
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                {t("pagination", {
                  total: pagination.total,
                  page: pagination.page,
                  pages: Math.max(pagination.total_pages, 1),
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  {tc("previous")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((current) => current + 1)}
                >
                  {tc("next")}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <ConfirmationDialog
        state={deleteConfirm}
        title={
          userToDelete
            ? t("deleteTitle", { name: userDisplayName(userToDelete) })
            : t("deleteTitleFallback")
        }
        description={
          userToDelete?.email
            ? t("deleteDescription", { email: userToDelete.email })
            : t("deleteDescriptionFallback")
        }
        confirmLabel={t("deleteConfirm")}
        isPending={deleteUser.isPending}
        onConfirm={async () => {
          if (!userToDelete) return;
          await deleteUser.mutateAsync(userToDelete.id);
        }}
      />
    </>
  );
};
