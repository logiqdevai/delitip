import { type FC } from "react";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { TaxDetailsSettingsForm } from "./components/tax-details-settings-form";

const TaxDetailsSettingsPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <TaxDetailsSettingsForm />
    </PlatformAdminGuard>
  );
};

export default TaxDetailsSettingsPage;
