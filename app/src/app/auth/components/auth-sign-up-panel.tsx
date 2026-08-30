"use client";

import { type FC } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/routes/routes";
import {
  AuthRoles,
  AuthRoleSwitcher,
} from "./auth-role-switcher";
import { AuthSignUpForm } from "./auth-sign-up-form";

export const AuthSignUpPanel: FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <AuthRoleSwitcher
        activeRole={AuthRoles.BUSINESS}
        onSelectBusiness={() => undefined}
        onSelectEmployee={() => {
          router.push(`${Routes.auth.sign_in}?role=employee`);
        }}
      />
      <AuthSignUpForm />
    </div>
  );
};
