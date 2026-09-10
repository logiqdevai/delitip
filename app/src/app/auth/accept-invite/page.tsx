import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { AuthAcceptInviteForm } from "../components/auth-accept-invite-form";

export const metadata: Metadata = {
  title: "Set Up Your Account - delitip",
  description: "Activate your delitip staff account.",
};

const AcceptInvitePage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthAcceptInviteForm />
    </Suspense>
  );
};

export default AcceptInvitePage;
