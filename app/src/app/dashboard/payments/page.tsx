import { type FC } from "react";
import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

// Payments now lives as a tab on the Tips page — this route stays only so
// older links and bookmarks keep working.
const PaymentsPage: FC = () => {
  redirect(Routes.dashboard.tipsPayments);
};

export default PaymentsPage;
