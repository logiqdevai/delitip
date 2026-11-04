import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  changePassword,
  forgotPassword,
  getResetTokenInfo,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
} from "@/features/auth/services/auth.services";
import type {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginEmailPayload,
  ResetPasswordPayload,
} from "@/features/auth/interfaces/auth.interfaces";
import type { BusinessSignUpFormData } from "@/features/auth/validation-schemas/auth.schema";
import { updateMe } from "@/features/users/services/users.services";
import { useAuthStore } from "@/stores/auth.store";
import { Routes } from "@/routes/routes";
import { toast } from "@/components/ui/toast";
import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { getErrorMessage } from "@/lib/api-error";

export const authQueryKeys = {
  root: ["auth"] as const,
  session: ["auth", "session"] as const,
};

// Remembers which sign-in tab (business vs. employee) a forgot-password
// request came from, since that context is otherwise lost once the person
// leaves the app to open the reset link from their email.
const AUTH_ROLE_HINT_STORAGE_KEY = "delitip-auth-role-hint";

const rememberAuthRoleHint = (role: "employee") => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_ROLE_HINT_STORAGE_KEY, role);
};

const consumeAuthRoleHint = (): "employee" | null => {
  if (typeof window === "undefined") return null;
  const hint = window.localStorage.getItem(AUTH_ROLE_HINT_STORAGE_KEY);
  if (hint) window.localStorage.removeItem(AUTH_ROLE_HINT_STORAGE_KEY);
  return hint === "employee" ? "employee" : null;
};

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.slice(1).join(" ") || undefined;
  return { first_name, last_name };
};

export const useLoginWithEmail = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginEmailPayload) => loginWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
    },
  });
};

export const useLoginBusiness = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginEmailPayload) => loginWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
      trackEvent(AnalyticsEvents.loginCompleted, { method: "email", account_type: "business" });
      toast.add({
        title: t("signedIn"),
        description: t("welcomeBack"),
        type: "success",
      });
      router.push(Routes.dashboard.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: t("signInFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useLoginEmployee = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginEmailPayload) => loginWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
      trackEvent(AnalyticsEvents.loginCompleted, { method: "email", account_type: "employee" });
      toast.add({
        title: t("signedIn"),
        description: t("welcomeEmployee"),
        type: "success",
      });
      router.push(Routes.employee.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: t("signInFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useRegisterWithEmail = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      registerWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
    },
  });
};

export const useRegisterBusiness = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: BusinessSignUpFormData) => {
      const auth = await registerWithEmail({
        email: payload.email,
        password: payload.password,
      });

      setSession({ accessToken: auth.access_token, user: auth.user });

      const { first_name, last_name } = splitFullName(payload.fullName);
      if (first_name) {
        try {
          await updateMe({ first_name, last_name });
        } catch {}
      }

      return auth;
    },
    onSuccess: () => {
      trackEvent(AnalyticsEvents.signUpCompleted, { method: "email", account_type: "business" });
      toast.add({
        title: t("accountCreated"),
        description: t("accountCreatedDescription"),
        type: "success",
      });
      router.push(Routes.onboarding);
    },
    onError: (error: Error) => {
      toast.add({
        title: t("signUpFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useForgotPassword = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload & { role?: "employee" }) => {
      if (payload.role === "employee") rememberAuthRoleHint("employee");
      return forgotPassword({ email: payload.email });
    },
    onSuccess: () => {
      trackEvent(AnalyticsEvents.passwordResetRequested);
    },
    onError: (error: Error) => {
      toast.add({
        title: t("resetEmailFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useResetPassword = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.passwordResetCompleted);
      toast.add({
        title: t("passwordUpdated"),
        description: t("passwordResetDescription"),
        type: "success",
      });
      const roleHint = consumeAuthRoleHint();
      router.push(
        roleHint === "employee"
          ? `${Routes.auth.sign_in}?role=employee`
          : Routes.auth.sign_in,
      );
    },
    onError: (error: Error) => {
      toast.add({
        title: t("resetFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useInviteInfo = (token: string) => {
  return useQuery({
    queryKey: [...authQueryKeys.root, "invite-info", token] as const,
    queryFn: () => getResetTokenInfo(token),
    enabled: !!token,
    retry: false,
  });
};

export const useAcceptInvite = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.inviteAccepted);
      toast.add({
        title: t("accountActivated"),
        description: t("accountActivatedDescription"),
        type: "success",
      });
      router.push(`${Routes.auth.sign_in}?role=employee`);
    },
    onError: (error: Error) => {
      toast.add({
        title: t("activateFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useChangePassword = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.passwordChanged);
      toast.add({
        title: t("passwordUpdated"),
        description: t("passwordChangedDescription"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("changePasswordFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useLogout = () => {
  const t = useTranslations("dashboard.shell.toasts.auth");
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return (options?: { redirectTo?: string }) => {
    trackEvent(AnalyticsEvents.logoutCompleted);
    clearSession();
    queryClient.clear();
    toast.add({
      title: t("signedOut"),
      description: t("signedOutDescription"),
      type: "success",
    });
    router.replace(options?.redirectTo ?? Routes.auth.sign_in);
  };
};
