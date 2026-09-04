import { type FC } from "react";
import { type Metadata } from "next";
import { PlatformAdminGuard } from "@/components/auth/platform-admin-guard";
import { AdminFinancePageContent } from "./components/admin-finance-page-content";

export const metadata: Metadata = {
  title: "Payments & Payouts — delitip",
  description: "Every payment and payout across all delitip businesses.",
};

const AdminFinancePage: FC = () => {
  return (
    <PlatformAdminGuard>
      <AdminFinancePageContent />
    </PlatformAdminGuard>
  );
};

export default AdminFinancePage;
