import { type Metadata } from "next";
import { type FC } from "react";
import { LegalDocument } from "../components/legal-document";
import { Routes } from "@/routes/routes";

export const metadata: Metadata = {
  title: "Terms of Service — delitip.com",
  description:
    "Terms of Service for delitip.com — digital tipping and customer feedback for businesses.",
};

const TermsPage: FC = () => {
  return (
    <LegalDocument
      title="Terms of Service"
      description="These draft terms describe how businesses, staff, and guests may use delitip.com. Final counsel-approved language will replace this placeholder before production launch."
      lastUpdated="August 29, 2026"
      alternateHref={Routes.legal.privacy}
      alternateLabel="Privacy Policy"
      sections={[
        {
          title: "1. Agreement",
          body: (
            <p>
              By creating an account or using delitip.com, you agree to these
              Terms of Service and our Privacy Policy. If you are accepting on
              behalf of a business, you confirm you have authority to bind that
              business.
            </p>
          ),
        },
        {
          title: "2. The service",
          body: (
            <>
              <p>
                delitip provides software for digital tipping, staff
                recognition, and customer feedback via QR codes and related
                tools. Features may change as we improve the product.
              </p>
              <p>
                Payment processing, payouts, and related financial services may
                be provided by third-party providers under their own terms.
              </p>
            </>
          ),
        },
        {
          title: "3. Accounts and access",
          body: (
            <p>
              You are responsible for account credentials, accurate business and
              staff information, and activity under your organization. Notify us
              promptly of unauthorized access. We may suspend accounts that
              misuse the service or violate these terms.
            </p>
          ),
        },
        {
          title: "4. Acceptable use",
          body: (
            <p>
              Do not use delitip to collect tips fraudulently, harass customers
              or staff, circumvent payment rules, scrape the service, or violate
              applicable law. Businesses remain responsible for how tips and
              feedback are handled under employment and consumer regulations in
              their jurisdiction.
            </p>
          ),
        },
        {
          title: "5. Fees and billing",
          body: (
            <p>
              Paid plans, transaction fees, and payout timing are described at
              signup or in your billing settings. Fees are subject to change with
              notice where required. Unpaid balances may limit access to paid
              features.
            </p>
          ),
        },
        {
          title: "6. Disclaimers and liability",
          body: (
            <p>
              The service is provided as available. To the fullest extent
              permitted by law, delitip disclaims warranties and limits
              liability for indirect or consequential damages arising from use
              of the platform. Nothing in these draft terms limits rights that
              cannot be waived under applicable law.
            </p>
          ),
        },
        {
          title: "7. Contact",
          body: (
            <p>
              For questions about these terms, contact{" "}
              <a
                href="mailto:info@delitip.com"
                className="font-medium text-ink-charcoal underline underline-offset-2"
              >
                info@delitip.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
};

export default TermsPage;
