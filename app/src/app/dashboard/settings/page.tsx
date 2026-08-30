import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

const SettingsPage = () => {
  redirect(Routes.dashboard.settings.profile);
};

export default SettingsPage;
