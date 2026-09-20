import { type FC } from "react";
import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

// Payouts now lives as a tab on the Tips page — this route stays only so
// older links and bookmarks keep working.
const PayoutsPage: FC = () => {
  redirect(Routes.dashboard.tipsPayouts);
};

export default PayoutsPage;
