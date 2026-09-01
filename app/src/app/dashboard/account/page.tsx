import { type FC } from "react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AccountSettingsForm } from "./components/account-settings-form";
import { ChangePasswordForm } from "./components/change-password-form";

const AccountPage: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Account"
        description="Your personal details across delitip."
      />
      <AccountSettingsForm />
      <ChangePasswordForm />
    </div>
  );
};

export default AccountPage;
