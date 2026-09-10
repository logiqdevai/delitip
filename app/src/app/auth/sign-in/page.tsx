import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { AuthSignInPanel } from "../components/auth-sign-in-panel";

export const metadata: Metadata = {
  title: "Sign In - delitip",
  description:
    "Sign in to delitip to manage tips, team payouts, and live customer reviews.",
};

const AuthSignInPage: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthSignInPanel />
    </Suspense>
  );
};

export default AuthSignInPage;
