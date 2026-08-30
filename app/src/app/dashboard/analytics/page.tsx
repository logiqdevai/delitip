import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

const AnalyticsPage = () => {
  redirect(Routes.dashboard.analytics.overview);
};

export default AnalyticsPage;
