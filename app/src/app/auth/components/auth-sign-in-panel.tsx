"use client";

import { type FC, useState } from "react";
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
  const initialRole: AuthRole =
    searchParams.get("role") === AuthRoles.EMPLOYEE
      ? AuthRoles.EMPLOYEE
      : AuthRoles.BUSINESS;
  const [role, setRole] = useState<AuthRole>(initialRole);

  return (
    <div>
      <AuthRoleSwitcher
        activeRole={role}
        onSelectBusiness={() => {
          setRole(AuthRoles.BUSINESS);
          router.replace(Routes.auth.sign_in);
        }}
        onSelectEmployee={() => {
          setRole(AuthRoles.EMPLOYEE);
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
