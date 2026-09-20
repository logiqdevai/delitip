import { type FC } from "react";
import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

// Tip distribution now lives as a tab on the QR codes page — this route stays
// only so older links and bookmarks keep working.
const DistributionPage: FC = () => {
  redirect(Routes.dashboard.accessDistribution);
};

export default DistributionPage;
