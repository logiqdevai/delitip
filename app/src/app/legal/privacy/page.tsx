import { type Metadata } from "next";
import { type FC } from "react";
import { LegalDocument } from "../components/legal-document";
import { Routes } from "@/routes/routes";

export const metadata: Metadata = {
  title: "Privacy Policy - delitip",
  description:
    "Privacy Policy for delitip - how we collect, use, and protect information.",
};

const PrivacyPage: FC = () => {
  return (
    <LegalDocument
      title="Privacy Policy"
      description="This policy explains how Delitip collects, uses, shares, and protects information when businesses, staff, and guests use delitip and the Delitip platform."
      lastUpdated="August 30, 2026"
      alternateHref={Routes.legal.terms}
      alternateLabel="Terms of Service"
      sections={[
        {
          title: "1. Who we are and what this policy covers",
          body: (
            <>
              <p>
                Delitip, of Pelasgon 32, Heraklion, Greece (“Delitip,”
                “we,” “us,” or “our”), provides a digital tipping, employee
                recognition, and customer feedback platform. We are the data
                controller for the personal information described in this
                policy, unless stated otherwise.
              </p>
              <p>
                This policy applies to information processed through: our
                marketing website; the business dashboard used by owners,
                managers, accountants, and staff; employee profiles created
                within a business's account; and the QR-code tipping and
                review flow used by customers at the point of service. It
                does not cover third-party sites we link to, or a business's
                own website or systems outside delitip.
              </p>
            </>
          ),
        },
        {
          title: "2. Information we collect",
          body: (
            <>
              <p>
                <strong>Business and staff accounts.</strong> When a
                business signs up or invites staff, we collect email
                address, phone number, first and last name, a hashed
                password, and role (Owner, Manager, Employee, or
                Accountant). We never store passwords in plain text.
              </p>
              <p>
                <strong>Employee profiles.</strong> A business can add
                employee profiles that include name, email, position, and an
                optional photo. Employee profiles are typically created and
                maintained by the business, not by the employee directly;
                see Section 13 for how employees can exercise their own
                rights over this information.
              </p>
              <p>
                <strong>Uploaded media.</strong> Business logos, cover
                images, and employee photos that a business uploads are
                stored on our behalf by our cloud storage provider (Section
                6).
              </p>
              <p>
                <strong>Tipping and review activity (customers).</strong>{" "}
                Customers scan a QR code to tip and optionally rate or
                review an employee or business. This flow does not require
                an account. We collect the tip amount and currency, a
                payment reference from our payment processor, and, if the
                customer chooses to leave one, a star rating and written
                feedback. Providing a name or email address at this step is
                always optional - if left blank, the tip or review is
                recorded without any identifying information about the
                customer. We do not collect or store the customer's IP
                address, device identifiers, or location as part of this
                flow.
              </p>
              <p>
                <strong>Payment information.</strong> Card and bank details
                are collected and processed directly by our payment
                processor, Stripe. Delitip does not receive or store full
                card numbers; we store only a payment reference and status
                supplied by Stripe.
              </p>
              <p>
                <strong>Communications.</strong> If you contact us, or if a
                business subscribes staff to optional marketing
                communications, we collect the content of that
                correspondence and the contact details needed to respond.
              </p>
              <p>
                <strong>Usage information.</strong> Our servers and hosting
                infrastructure generate standard technical logs (such as
                timestamps and request status) needed to operate and secure
                the service. We do not currently use analytics, advertising,
                or tracking cookies on delitip.
              </p>
            </>
          ),
        },
        {
          title: "3. How we use information",
          body: (
            <>
              <p>We use the information described above to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  operate the tipping, review, and feedback flow, and
                  process payments and payouts through Stripe;
                </li>
                <li>
                  show businesses and employees their own tips, reviews,
                  feedback, and performance analytics;
                </li>
                <li>
                  generate feedback summaries and sentiment analysis using
                  our AI provider (Section 5), to help businesses spot
                  trends without reading every review manually;
                </li>
                <li>
                  create, secure, and support user accounts, including
                  password resets and account verification;
                </li>
                <li>
                  send transactional communications, such as password-reset
                  codes and service notices;
                </li>
                <li>
                  send optional marketing communications where a recipient
                  has opted in (Section 14);
                </li>
                <li>
                  detect, investigate, and prevent fraud, abuse, and
                  security incidents;
                </li>
                <li>
                  comply with legal, tax, and accounting obligations; and
                </li>
                <li>improve and maintain the platform.</li>
              </ul>
              <p>We do not sell personal information, and we never will.</p>
            </>
          ),
        },
        {
          title: "4. Legal bases for processing (EEA/UK users)",
          body: (
            <>
              <p>
                Where the General Data Protection Regulation (GDPR) applies,
                we rely on the following legal bases:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Contract:</strong> to create and administer
                  business, staff, and employee accounts, and to process
                  tips and payouts.
                </li>
                <li>
                  <strong>Legitimate interests:</strong> to keep the
                  platform secure, prevent fraud and abuse, generate
                  aggregate feedback analytics for a business, and improve
                  the service - balanced against your interests and rights.
                </li>
                <li>
                  <strong>Consent:</strong> where a customer voluntarily
                  provides their name or email with a tip or review, and for
                  optional marketing communications.
                </li>
                <li>
                  <strong>Legal obligation:</strong> to meet tax, accounting,
                  and payment-regulation requirements.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "5. How we use AI to process feedback",
          body: (
            <p>
              We use OpenAI's models to analyze the sentiment of, and
              generate trend summaries from, review and feedback text
              submitted by customers, so a business can see patterns (for
              example, a satisfaction shift or a recurring complaint)
              without reading every entry individually. Review and feedback
              text may be sent to OpenAI for this purpose under a
              data-processing agreement that restricts its use of that
              content. Composite metrics such as the Customer Experience
              Score are informational and always shown with an explanation
              of the factors behind them - we do not use AI to make fully
              automated decisions that produce legal or similarly
              significant effects about any individual, such as employment
              or disciplinary decisions.
            </p>
          ),
        },
        {
          title: "6. Who we share information with",
          body: (
            <>
              <p>
                We share information with the following categories of
                service providers, each acting on our instructions to help
                us run the platform:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Stripe</strong> - payment processing, payouts, and
                  connected business accounts;
                </li>
                <li>
                  <strong>OpenAI</strong> - feedback sentiment analysis and
                  summarization (Section 5);
                </li>
                <li>
                  <strong>Google Cloud Storage</strong> - storage of
                  uploaded logos, cover images, and employee photos;
                </li>
                <li>
                  <strong>Resend and our SMTP provider</strong> - delivery
                  of transactional and, where opted in, marketing email;
                </li>
                <li>
                  <strong>Twilio</strong> - delivery of one-time SMS
                  verification codes;
                </li>
                <li>
                  <strong>Google Maps</strong> - geocoding and time zone
                  lookup for a business's location, not for tracking any
                  individual's location; and
                </li>
                <li>
                  our infrastructure and hosting providers, who host the
                  application and database.
                </li>
              </ul>
              <p>
                A business using Delitip can see tips, reviews, feedback,
                and analytics for its own locations and employees.
                Employees granted dashboard access can see their own tips,
                ratings, and feedback. We do not give one business access to
                another business's data.
              </p>
              <p>
                We may also disclose information where required by law, to
                respond to a valid legal request, or to protect the rights,
                property, or safety of Delitip, our users, or the public. If
                Delitip is involved in a merger, acquisition, or asset sale,
                information may be transferred as part of that transaction,
                subject to this policy.
              </p>
            </>
          ),
        },
        {
          title: "7. International data transfers",
          body: (
            <p>
              Delitip is based in Greece, in the European Economic Area. The
              service providers listed in Section 6 are based in, or
              process data in, the United States. Where we transfer
              personal information outside the EEA/UK, we rely on
              appropriate safeguards recognized under GDPR, such as the
              European Commission's Standard Contractual Clauses or an
              equivalent mechanism, and we require our providers to protect
              information to a standard consistent with this policy.
            </p>
          ),
        },
        {
          title: "8. How long we keep information",
          body: (
            <>
              <p>
                We keep personal information for as long as needed for the
                purposes described in this policy, then delete or
                deactivate it. In practice:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Business, staff, and employee accounts are retained while
                  active. A deactivated or archived account is marked
                  inactive rather than immediately erased, so a business can
                  restore staff access or historical records; underlying
                  authentication data (such as password-reset codes) is
                  removed when an account is deleted.
                </li>
                <li>
                  Tip, payment, and refund records are kept for as long as
                  required to meet our tax, accounting, and financial
                  regulatory obligations, even after an associated account is
                  deactivated.
                </li>
                <li>
                  Reviews and feedback are retained to preserve a business's
                  historical analytics and performance record, unless a
                  customer who provided identifying information requests
                  its removal (Sections 10–11).
                </li>
              </ul>
              <p>
                Where we are not required to retain information, we will
                delete it, or remove identifying details from it, upon a
                verified request.
              </p>
            </>
          ),
        },
        {
          title: "9. How we protect information",
          body: (
            <>
              <p>
                We use technical and organizational measures appropriate to
                the sensitivity of the data we hold, including encryption of
                data in transit, hashed (never plain-text) passwords,
                token-based authentication, and role-based access controls
                so staff only see the locations, employees, and data their
                role permits. We do not store full payment card details -
                that is handled entirely by Stripe.
              </p>
              <p>
                Session access to the dashboard is authenticated using a
                bearer token that, on the web, is currently stored in your
                browser's local storage rather than a server-set cookie. As
                with any credential, avoid using the dashboard on shared or
                untrusted devices, and sign out when finished.
              </p>
              <p>
                No method of transmission or storage is completely secure.
                If we become aware of a breach affecting your personal
                information, we will notify affected individuals and
                relevant authorities as required by applicable law.
              </p>
            </>
          ),
        },
        {
          title: "10. Your rights under GDPR",
          body: (
            <>
              <p>
                If you are located in the EEA or UK, you have the right to:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>access the personal information we hold about you;</li>
                <li>correct inaccurate or incomplete information;</li>
                <li>
                  request erasure of your information, subject to our
                  retention obligations in Section 8;
                </li>
                <li>
                  restrict or object to certain processing, including
                  processing based on legitimate interests;
                </li>
                <li>receive your information in a portable format; and</li>
                <li>
                  withdraw consent at any time, where processing is based on
                  consent, without affecting processing carried out before
                  the withdrawal.
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us using the
                details in Section 16. You also have the right to lodge a
                complaint with the Hellenic Data Protection Authority
                (Greece) or your local supervisory authority.
              </p>
            </>
          ),
        },
        {
          title: "11. Your rights under CCPA/CPRA (California residents)",
          body: (
            <>
              <p>If you are a California resident, you have the right to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  know what personal information we have collected about
                  you and how it has been used and disclosed;
                </li>
                <li>request deletion of your personal information;</li>
                <li>
                  correct inaccurate personal information we hold about
                  you; and
                </li>
                <li>
                  opt out of the sale or sharing of personal information -
                  we do not sell or share personal information as those
                  terms are defined under the CCPA/CPRA, so there is nothing
                  to opt out of.
                </li>
              </ul>
              <p>
                We will not discriminate against you for exercising any of
                these rights. To submit a request, contact us using the
                details in Section 16.
              </p>
            </>
          ),
        },
        {
          title: "12. Cookies and local storage",
          body: (
            <>
              <p>
                delitip uses a single functional cookie to remember
                whether the dashboard sidebar is expanded or collapsed. It
                does not identify you or track you across sites. The
                dashboard also stores your session sign-in token in your
                browser's local storage so you stay signed in between visits
                (Section 9).
              </p>
              <p>
                We do not currently use analytics, advertising, or
                cross-site tracking cookies. If that changes, we will update
                this policy and provide a cookie consent and preference tool
                before doing so. You can control or clear cookies and local
                storage through your browser settings at any time, though
                doing so may sign you out or reset dashboard preferences.
              </p>
            </>
          ),
        },
        {
          title: "13. Employee profile information",
          body: (
            <p>
              Employee profiles (name, email, position, and photo) are
              usually created by the business a person works for, as part
              of setting up tipping and recognition for its team. If you
              are an employee featured on a business's Delitip page and want
              to access, correct, or request removal of your profile
              information, you can ask your employer, or contact us
              directly at the address in Section 16 and we will work with
              the relevant business to resolve your request.
            </p>
          ),
        },
        {
          title: "14. Marketing communications",
          body: (
            <p>
              With your opt-in consent, we or a business may send marketing
              communications by email or SMS - for example, product updates
              or promotional offers. These are separate from the
              transactional messages described in Section 3 (such as
              password-reset codes), which are necessary to operate your
              account and are not optional. Every marketing message includes
              a clear way to unsubscribe or opt out, and we will honor that
              choice going forward.
            </p>
          ),
        },
        {
          title: "15. Children's privacy",
          body: (
            <p>
              Delitip is not directed at children, and we do not knowingly
              collect personal information from anyone under 16 (or the
              relevant minimum age in your jurisdiction, such as 13 in the
              United States). If you believe a child has provided us with
              personal information, contact us using the details in Section
              16 and we will delete it.
            </p>
          ),
        },
        {
          title: "16. Changes to this policy",
          body: (
            <p>
              We may update this policy from time to time to reflect
              changes to our practices or for legal, regulatory, or
              operational reasons. We will update the "Last updated" date
              above, and where a change is material, we will provide
              additional notice, such as an email to account holders or a
              notice on our website.
            </p>
          ),
        },
        {
          title: "17. Contact us",
          body: (
            <p>
              For privacy questions or to exercise any of the rights
              described above, contact us at{" "}
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

export default PrivacyPage;
