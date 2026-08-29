import { type Metadata } from "next";
import { type FC } from "react";
import { LegalDocument } from "../components/legal-document";
import { Routes } from "@/routes/routes";

export const metadata: Metadata = {
  title: "Privacy Policy — delitip.com",
  description:
    "Privacy Policy for delitip.com — how we collect, use, and protect information.",
};

const PrivacyPage: FC = () => {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="This draft policy explains how delitip.com handles information for businesses, staff, and guests. Final counsel-approved language will replace this placeholder before production launch."
      lastUpdated="August 29, 2026"
      alternateHref={Routes.legal.terms}
      alternateLabel="Terms of Service"
      sections={[
        {
          title: "1. Who we are",
          body: (
            <p>
              delitip.com (“delitip”, “we”) provides digital tipping and customer
              feedback tools. This policy covers information processed when you
              visit our marketing site, create an account, tip via a QR code, or
              leave feedback.
            </p>
          ),
        },
        {
          title: "2. Information we collect",
          body: (
            <>
              <p>
                Depending on how you use the product, we may process account
                details (name, email, business info), tip and review content,
                device and usage data, and payment-related identifiers handled by
                our payment partners.
              </p>
              <p>
                Guests tipping via QR typically provide tip amounts and optional
                feedback; they are not required to create a delitip account.
              </p>
            </>
          ),
        },
        {
          title: "3. How we use information",
          body: (
            <p>
              We use information to operate tipping and feedback flows, show
              businesses and staff their earnings and reviews, improve the
              product, prevent fraud and abuse, and communicate about the
              service. We do not sell personal information.
            </p>
          ),
        },
        {
          title: "4. Sharing",
          body: (
            <p>
              We share data with service providers who help us run the platform
              (hosting, analytics, payments, email) under appropriate
              agreements. Businesses see tips and reviews for their stores and
              staff. We may disclose information when required by law or to
              protect rights and safety.
            </p>
          ),
        },
        {
          title: "5. Retention and security",
          body: (
            <p>
              We retain information as needed to provide the service, meet legal
              obligations, and resolve disputes. We apply technical and
              organizational measures appropriate to the sensitivity of the
              data. No method of transmission or storage is perfectly secure.
            </p>
          ),
        },
        {
          title: "6. Your choices",
          body: (
            <p>
              Account holders can update profile details in settings and contact
              us to request access, correction, or deletion where applicable.
              Marketing emails include an unsubscribe option. Cookie and similar
              preferences may be managed through your browser where available.
            </p>
          ),
        },
        {
          title: "7. Contact",
          body: (
            <p>
              For privacy questions or requests, contact{" "}
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

export default PrivacyPage;
