import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  changePassword,
  forgotPassword,
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
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginEmailPayload) => loginWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
      toast.add({
        title: "Signed in",
        description: "Welcome back to delitip.",
        type: "success",
      });
      router.push(Routes.dashboard.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not sign in",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useLoginEmployee = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginEmailPayload) => loginWithEmail(payload),
    onSuccess: (data: AuthResponse) => {
      setSession({ accessToken: data.access_token, user: data.user });
      toast.add({
        title: "Signed in",
        description: "Welcome to your tip profile.",
        type: "success",
      });
      router.push(Routes.employee.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not sign in",
        description: error.message,
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
      toast.add({
        title: "Account created",
        description: "Finish a few details to open your dashboard.",
        type: "success",
      });
      router.push(Routes.onboarding);
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not create account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload & { role?: "employee" }) => {
      if (payload.role === "employee") rememberAuthRoleHint("employee");
      return forgotPassword({ email: payload.email });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not send reset email",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      toast.add({
        title: "Password updated",
        description: "You can sign in with your new password.",
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
        title: "Could not reset password",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useAcceptInvite = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      toast.add({
        title: "Account activated",
        description: "You can now sign in with your new password.",
        type: "success",
      });
      router.push(Routes.auth.sign_in);
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not activate account",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.add({
        title: "Password updated",
        description: "Your password has been changed.",
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not change password",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return (options?: { redirectTo?: string }) => {
    clearSession();
    queryClient.clear();
    toast.add({
      title: "Signed out",
      description: "You have been signed out of delitip.",
      type: "success",
    });
    router.replace(options?.redirectTo ?? Routes.auth.sign_in);
  };
};
