import { getTranslations } from "next-intl/server";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { AccountSettingsForm } from "./components/account-settings-form";
import { ChangePasswordForm } from "./components/change-password-form";

const AccountPage = async () => {
  const t = await getTranslations("dashboard.shell.account");

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
      />
      <AccountSettingsForm />
      <ChangePasswordForm />
    </div>
  );
};

export default AccountPage;
