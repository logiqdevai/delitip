import { type FC } from "react";
import type { Metadata } from "next";
import { ClientBusinessView } from "./components/client-business-view";
import { ClientCustomerFlow } from "./components/client-customer-flow";
import { ClientPrototypeShell } from "./components/client-prototype-shell";

export const metadata: Metadata = {
  title: "Prototype Experience — delitip.com",
  description:
    "Explore the delitip.com customer tipping flow and business dashboard prototype.",
};

const ClientPage: FC = () => {
  return (
    <ClientPrototypeShell
      customerView={<ClientCustomerFlow />}
      businessView={<ClientBusinessView />}
    />
  );
};

export default ClientPage;
