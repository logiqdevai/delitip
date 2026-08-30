"use client";

import { type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Routes } from "@/routes/routes";
import { AuthEmployeeForm } from "./auth-employee-form";
import {
  AuthRoles,
  AuthRoleSwitcher,
  type AuthRole,
} from "./auth-role-switcher";
import { AuthSignInForm } from "./auth-sign-in-form";

export const AuthSignInPanel: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role: AuthRole =
    searchParams.get("role") === AuthRoles.EMPLOYEE
      ? AuthRoles.EMPLOYEE
      : AuthRoles.BUSINESS;

  return (
    <div>
      <AuthRoleSwitcher
        activeRole={role}
        onSelectBusiness={() => {
          router.replace(Routes.auth.sign_in);
        }}
        onSelectEmployee={() => {
          router.replace(`${Routes.auth.sign_in}?role=employee`);
        }}
      />
      {role === AuthRoles.EMPLOYEE ? (
        <AuthEmployeeForm />
      ) : (
        <AuthSignInForm />
      )}
    </div>
  );
};
