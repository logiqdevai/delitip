import { type Metadata } from "next";
import { type FC } from "react";
import Link from "next/link";
import { LegalDocument } from "../components/legal-document";
import { Routes } from "@/routes/routes";

export const metadata: Metadata = {
  title: "Terms of Service - delitip",
  description:
    "Terms of Service for delitip - digital tipping and customer feedback for businesses.",
};

const TermsPage: FC = () => {
  return (
    <LegalDocument
      title="Terms of Service"
      description="These terms describe how businesses, staff, and guests may use delitip and the Delitip platform."
      lastUpdated="August 30, 2026"
      alternateHref={Routes.legal.privacy}
      alternateLabel="Privacy Policy"
      sections={[
        {
          title: "1. Agreement to these terms",
          body: (
            <>
              <p>
                These Terms of Service ("Terms") are a contract between you
                and Delitip, of Pelasgon 32, Heraklion, Greece ("Delitip,"
                "we," "us," or "our"), governing your access to and use of
                delitip and the Delitip platform (the "Service"). By
                creating an account, or by using the Service in any other
                way, you agree to these Terms and our{" "}
                <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                  Privacy Policy
                </Link>
                . If you are accepting on behalf of a business, you confirm
                you have the authority to bind that business, and "you"
                refers to that business.
              </p>
              <p>
                A customer who scans a QR code to leave a tip or feedback
                does not need to create an account or affirmatively accept
                these Terms; Section 7 sets out the more limited terms that
                apply to that guest activity.
              </p>
            </>
          ),
        },
        {
          title: "2. Eligibility and accounts",
          body: (
            <>
              <p>
                You must be at least 18 years old, and able to form a
                binding contract, to create a Delitip account. You are
                responsible for the accuracy of the business and staff
                information you provide, for keeping your login credentials
                confidential, and for all activity that occurs under your
                account or organization.
              </p>
              <p>
                Access within an organization is role-based (Owner,
                Manager, Employee, or Accountant), and it is your
                responsibility to grant each role only to people who should
                have that level of access. Notify us promptly at{" "}
                <a
                  className="underline underline-offset-2"
                  href="mailto:info@delitip.com"
                >
                  info@delitip.com
                </a>{" "}
                if you suspect unauthorized access to your account.
              </p>
            </>
          ),
        },
        {
          title: "3. The Service",
          body: (
            <>
              <p>
                Delitip provides software for digital tipping via QR code,
                staff recognition, and customer feedback and review
                collection, along with related dashboards, analytics, and
                AI-assisted feedback summarization. We may add, change, or
                remove features as we improve the product, and we will try
                to give reasonable notice of changes that materially reduce
                functionality you rely on.
              </p>
              <p>
                Delitip is a software platform, not a bank, payment
                institution, or money transmitter. Payment processing,
                payouts, and related financial services are provided by
                third-party payment processors (Section 5) under their own
                terms, which you must also agree to in order to receive
                tips or payouts.
              </p>
            </>
          ),
        },
        {
          title: "4. Subscription plans and billing",
          body: (
            <>
              <p>
                Businesses use Delitip under a subscription plan (currently
                Starter, Professional, or Enterprise), which determines
                available features such as the number of locations,
                analytics depth, and support level. Pricing, billing
                frequency, and any transaction fees are shown to you at
                signup or in your billing settings, and form part of these
                Terms once you subscribe.
              </p>
              <p>
                Unless stated otherwise, subscriptions renew automatically
                for successive billing periods until cancelled. You can
                cancel at any time in your billing settings; cancellation
                takes effect at the end of the current billing period, and
                we do not provide prorated refunds for partial periods
                except where required by law. We may suspend access to
                paid features if a payment fails and is not resolved after
                reasonable notice, and we may change fees on a going-forward
                basis with notice as required by applicable law.
              </p>
            </>
          ),
        },
        {
          title: "5. Tips, payments, and payouts",
          body: (
            <>
              <p>
                Customer tips are collected and payouts to businesses and,
                where enabled, individual employees are processed through
                third-party payment providers such as Stripe. To receive
                tips or payouts, a business (and, where applicable, an
                employee) must complete that provider's own onboarding,
                which may include identity verification required by law.
                We do not receive or store full payment card details;
                see our{" "}
                <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                  Privacy Policy
                </Link>{" "}
                for how payment-related information is handled.
              </p>
              <p>
                Payout timing, minimum thresholds, and any processor fees
                are set by the payment provider and shown in your dashboard.
                Delitip is not responsible for delays, failures, or losses
                caused by a payment provider, incorrect payout details you
                provided, or your bank's own processing times.
              </p>
            </>
          ),
        },
        {
          title: "6. Refunds",
          body: (
            <p>
              A refund of a tip can be requested - typically by the
              customer or by a store manager acting on their behalf - and
              must be reviewed and approved by an authorized user, such as
              a Manager or Accountant, before it is processed. We may set
              reasonable eligibility windows or limits on refunds to
              prevent abuse. Approved refunds are returned through the same
              payment provider used to collect the original tip, and are
              subject to that provider's processing times. Subscription
              fees are addressed separately in Section 4.
            </p>
          ),
        },
        {
          title: "7. Guest use - scanning, tipping, and reviewing",
          body: (
            <>
              <p>
                Anyone can scan a Delitip QR code to view a business's page
                and, if they choose, leave a tip and/or a rating or written
                review. This does not require creating an account. By
                doing so, you agree to use this feature honestly and
                lawfully: tips are a voluntary gesture and are non-
                refundable except as described in Section 6 or required by
                law, and reviews and feedback must be your genuine
                experience - not fabricated, purchased, posted on behalf of
                someone else without their knowledge, defamatory, or
                otherwise unlawful.
              </p>
              <p>
                We and the business may remove or decline to display
                content that violates this section or applicable law. See
                our{" "}
                <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                  Privacy Policy
                </Link>{" "}
                for what information is collected during this flow.
              </p>
            </>
          ),
        },
        {
          title: "8. Acceptable use",
          body: (
            <>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  use the Service to collect tips fraudulently, launder
                  funds, or circumvent fees or payment-provider rules;
                </li>
                <li>
                  post or solicit fake, incentivized, or misleading reviews,
                  or otherwise manipulate ratings or analytics;
                </li>
                <li>
                  harass, threaten, or discriminate against customers or
                  staff through the Service;
                </li>
                <li>
                  scrape, reverse-engineer, or probe the Service beyond
                  normal use, or attempt to access another organization's
                  data or accounts;
                </li>
                <li>
                  upload malicious code, or interfere with the Service's
                  security or normal operation; or
                </li>
                <li>
                  use the Service in a way that violates applicable law,
                  including employment, consumer-protection, tax, and data
                  protection law in your jurisdiction.
                </li>
              </ul>
              <p>
                As between you and Delitip, a business remains responsible
                for how it handles tips, employee data, and feedback under
                the employment and consumer laws that apply to it - Delitip
                provides the software, not legal or tax advice.
              </p>
            </>
          ),
        },
        {
          title: "9. Business content and employee data",
          body: (
            <p>
              When you add content to your account - such as a business
              profile, logo, cover image, employee names and photos,
              custom feedback questions, or branded messages - you
              represent that you have the right to use it and, where the
              content relates to another person (for example, an
              employee's name or photo), that you have the necessary
              authority or consent under applicable employment and data
              protection law to add it to Delitip and display it to
              customers. You are responsible for keeping this information
              accurate and for removing it if that authority or consent
              ends.
            </p>
          ),
        },
        {
          title: "10. Intellectual property",
          body: (
            <>
              <p>
                Delitip and its licensors own the Service, including its
                software, design, and branding, and no rights are granted
                to you except the limited right to use the Service under
                these Terms.
              </p>
              <p>
                You (or the business you represent) retain ownership of the
                content you upload, such as your logo, brand assets,
                employee data, and customer feedback ("Your Content"). You
                grant Delitip a non-exclusive, worldwide license to host,
                store, reproduce, and display Your Content solely as needed
                to provide and improve the Service to you.
              </p>
            </>
          ),
        },
        {
          title: "11. Third-party services",
          body: (
            <p>
              The Service relies on third-party providers to operate,
              including Stripe for payments and payouts, OpenAI for
              feedback analysis, Google Cloud Storage for file storage,
              Resend and our SMTP provider for email, Twilio for SMS
              verification, and Google Maps for location lookup (see our{" "}
              <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                Privacy Policy
              </Link>{" "}
              for details). These providers operate under their own terms
              and are not controlled by Delitip; while we select providers
              we consider reliable, we are not responsible for their acts,
              omissions, or downtime, except as required by applicable
              law.
            </p>
          ),
        },
        {
          title: "12. AI-assisted feedback analysis",
          body: (
            <p>
              Sentiment analysis, feedback summaries, and composite scores
              generated by the Service are provided to help you understand
              trends in customer feedback, and are informational only. They
              may be incomplete or inaccurate, and should not be treated as
              the sole basis for employment, disciplinary, or other
              significant decisions about a specific employee.
            </p>
          ),
        },
        {
          title: "13. Suspension and termination",
          body: (
            <>
              <p>
                You may stop using the Service and close your account at
                any time. We may suspend or terminate your access if you
                materially breach these Terms, if we reasonably believe
                your account poses a fraud, security, or legal risk, or if
                required by a payment provider or applicable law - where
                practical, we will give you notice and an opportunity to
                resolve the issue first.
              </p>
              <p>
                On termination, your right to use the Service ends, but
                obligations that by their nature should survive - including
                payment obligations, outstanding refund handling, the
                license you granted us over previously submitted Your
                Content as needed to wind down the account, and Sections
                10, 15–17, and this Section - continue to apply. We handle
                information after termination as described in our{" "}
                <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          title: "14. Disclaimers",
          body: (
            <p>
              The Service is provided "as is" and "as available." To the
              fullest extent permitted by law, Delitip disclaims all
              warranties, express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement, and
              does not guarantee that the Service will be uninterrupted,
              error-free, or fully secure. Nothing in this section limits
              any warranty or right that cannot be excluded under
              applicable law, including statutory consumer protections.
            </p>
          ),
        },
        {
          title: "15. Limitation of liability",
          body: (
            <p>
              To the fullest extent permitted by law, Delitip will not be
              liable for indirect, incidental, special, consequential, or
              punitive damages, or for lost profits, revenue, or data,
              arising from your use of the Service. Our total liability
              for any claim arising out of or relating to these Terms or
              the Service will not exceed the fees you paid to Delitip in
              the 12 months before the claim arose. This limitation does
              not apply to liability that cannot be limited under
              applicable law, including liability for fraud, gross
              negligence, willful misconduct, or death or personal injury
              caused by our negligence.
            </p>
          ),
        },
        {
          title: "16. Indemnification",
          body: (
            <p>
              You agree to defend, indemnify, and hold Delitip harmless
              from third-party claims, losses, and expenses (including
              reasonable legal fees) arising from your use of the Service
              in violation of these Terms or applicable law, or from Your
              Content, including any failure to obtain the rights or
              consents described in Section 9.
            </p>
          ),
        },
        {
          title: "17. Governing law and disputes",
          body: (
            <p>
              These Terms are governed by the laws of Greece, without
              regard to conflict-of-laws principles. Subject to any
              mandatory consumer-protection rights you may have in your
              country of residence, the courts of Heraklion, Greece will
              have exclusive jurisdiction over any dispute arising out of
              or relating to these Terms or the Service. Before starting a
              formal proceeding, we encourage you to contact us at{" "}
              <a
                className="underline underline-offset-2"
                href="mailto:info@delitip.com"
              >
                info@delitip.com
              </a>{" "}
              so we can try to resolve the issue directly.
            </p>
          ),
        },
        {
          title: "18. Changes to these terms",
          body: (
            <p>
              We may update these Terms from time to time to reflect
              changes to the Service or for legal or operational reasons.
              We will update the "Last updated" date above, and where a
              change is material, we will provide additional notice, such
              as an email to account holders or a notice on our website.
              Continuing to use the Service after a change takes effect
              means you accept the updated Terms.
            </p>
          ),
        },
        {
          title: "19. General",
          body: (
            <p>
              If any provision of these Terms is found unenforceable, the
              remaining provisions continue in full effect. Our failure to
              enforce a provision is not a waiver of it. You may not
              assign these Terms without our consent; we may assign them
              in connection with a merger, acquisition, or sale of assets.
              Neither party is liable for delays caused by events beyond
              its reasonable control. These Terms, together with our{" "}
              <Link className="underline underline-offset-2" href={Routes.legal.privacy}>
                Privacy Policy
              </Link>
              , are the entire agreement between you and Delitip regarding
              the Service.
            </p>
          ),
        },
        {
          title: "20. Contact us",
          body: (
            <p>
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:info@delitip.com"
                className="font-medium text-ink-charcoal underline underline-offset-2"
              >
                info@delitip.com
              </a>
              , or by mail at Delitip, Pelasgon 32, Heraklion, Greece.
            </p>
          ),
        },
      ]}
    />
  );
};

export default TermsPage;
