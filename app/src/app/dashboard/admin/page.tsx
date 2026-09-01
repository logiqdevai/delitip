import { redirect } from "next/navigation";
import { Routes } from "@/routes/routes";

const AdminPage = () => {
  redirect(Routes.dashboard.admin.analytics);
};

export default AdminPage;
