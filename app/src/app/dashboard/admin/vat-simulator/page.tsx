import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminVatSimulatorPageContent } from "./components/admin-vat-simulator-page-content";

export const metadata: Metadata = {
  title: "VAT Simulator — delitip",
  description:
    "Simulate the tip → platform → store/employee accounting and VAT flow.",
};

const AdminVatSimulatorPage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminVatSimulatorPageContent />
    </PlatformAdminGuard>
  );
};

export default AdminVatSimulatorPage;
