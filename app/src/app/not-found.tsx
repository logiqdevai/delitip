import { type FC } from "react";
import type { Metadata } from "next";
import { NotFoundStatusPage } from "@/components/system/app-status-page";

export const metadata: Metadata = {
  title: "Page not found — delitip",
  description: "The page you are looking for does not exist.",
};

const NotFoundPage: FC = () => {
  return <NotFoundStatusPage />;
};

export default NotFoundPage;
