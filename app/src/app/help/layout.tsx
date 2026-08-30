import { type FC, type ReactNode } from "react";
import { LandingHeader } from "../(landing)/components/landing-header";
import { LandingFooter } from "../(landing)/components/landing-footer";

const HelpLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
};

export default HelpLayout;
