import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import { useMe } from "@/features/users/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Platform-level staff role (USER/ADMIN/SUPER_ADMIN/SUPPORT), distinct from
 * the per-organization role (OWNER/STORE_MANAGER/ACCOUNTANT) exposed by
 * useWorkspace(). Falls back to the cached auth-store user while /users/me
 * is loading so gated UI doesn't flash.
 */
export const usePlatformRole = () => {
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe();
  const role = meQuery.data?.role ?? authUser?.role;
  const isPending = meQuery.isPending && !authUser?.role;

  return {
    role,
    isPending,
    isPlatformAdmin:
      role === PlatformAuthRoles.ADMIN ||
      role === PlatformAuthRoles.SUPER_ADMIN,
  };
};
