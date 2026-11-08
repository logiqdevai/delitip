import { type FC, type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => <>{children}</>;

export default Layout;
