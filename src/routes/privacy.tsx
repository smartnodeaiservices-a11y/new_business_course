import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";

export default function PrivacyPage() {
  usePageMeta({
    title: "Privacy Policy — New Business Course",
    description:
      "How NewBusinessCourse.com collects, uses, and protects your personal information.",
  });
  return (
    <>
      <section className="bg-navy text-white px-6 md:px-10 py-16">
        <div className="max-w-[860px] mx-auto">
          <p className="eyebrow mb-3 text-gold!">Legal</p>
          <h1 className="text-white mb-3">Privacy Policy</h1>
          <p className="text-white/60 text-[14px]">
            Effective Date: March 17, 2026 · Last Updated: April 8, 2026
          </p>
        </div>
      </section>

      <section className="max-w-[860px] mx-auto px-6 md:px-10 py-14 legal-prose">
        <h2>1. Who We Are</h2>
        <p>
          NewBusinessCourse.com operates as an online education platform offering courses
          for new business owners. This policy explains how we handle personal
          information across our website and course offerings. For policy questions,
          reach the team at{" "}
          <a href="mailto:privacy@newbusinesscourse.com">privacy@newbusinesscourse.com</a>.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Directly Provided Data</h3>
        <ul>
          <li>Name and email when purchasing courses or subscribing</li>
          <li>Billing name and address for transactions</li>
          <li>Payment details processed through Stripe (not stored internally)</li>
          <li>User communications and inquiries</li>
        </ul>
        <h3>Automatically Collected Data</h3>
        <ul>
          <li>Usage patterns including pages visited and course progress</li>
          <li>Device information such as IP address and browser type</li>
          <li>Cookie and tracking data (detailed in Section 5)</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use collected data to process purchases, deliver course access, send
          transactional emails, respond to support requests, and analyze usage for
          improvement. <strong>We do not sell your personal information to third parties.</strong>
        </p>
        <p>
          Marketing emails and promotional content may be sent, with opt-out available
          anytime through any email's unsubscribe link.
        </p>

        <h2>4. Legal Basis for Processing (GDPR)</h2>
        <p>
          European users' data processing relies on contract fulfillment, legitimate
          business interests, explicit consent for marketing, and legal compliance
          obligations.
        </p>

        <h2>5. Cookies &amp; Tracking Technologies</h2>
        <p>We use three cookie categories:</p>
        <ul>
          <li>Essential cookies (required for functionality)</li>
          <li>Analytics cookies for user interaction insights</li>
          <li>Marketing cookies deployed with user consent</li>
        </ul>
        <p>
          You can manage non-essential cookies through your browser settings without
          losing course access.
        </p>

        <h2>6. Third-Party Service Providers</h2>
        <p>
          Data sharing occurs with Stripe (payments), email providers, analytics
          platforms, and U.S.-based hosting providers. We require all vendors to maintain
          appropriate security standards.
        </p>

        <h2>7. Data Retention</h2>
        <ul>
          <li>Account/purchase records: 7 years for compliance</li>
          <li>Email marketing data: until you unsubscribe</li>
          <li>Analytics: up to 26 months in anonymized form</li>
        </ul>

        <h2>8. Your Rights</h2>
        <p>
          You may request access, correction, deletion, or portability of your data.
          Marketing opt-out occurs through email unsubscribe links. California residents
          have additional CCPA rights. We respond to rights requests within 30 days via{" "}
          <a href="mailto:privacy@newbusinesscourse.com">privacy@newbusinesscourse.com</a>.
        </p>

        <h2>9. Data Security</h2>
        <p>
          We implement industry-standard security measures including SSL/TLS encryption,
          access controls, and regular security reviews. Payment data remains exclusively
          with Stripe.
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          Our services are not directed toward individuals under 18, and we do not
          intentionally collect information from minors.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          Updates appear on this page with revised dates. Material changes trigger email
          notification to customers at least 14 days prior to implementation.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          <strong>Privacy Inquiries:</strong>{" "}
          <a href="mailto:privacy@newbusinesscourse.com">privacy@newbusinesscourse.com</a>
          <br />
          <strong>General Contact:</strong>{" "}
          <a href="mailto:hello@newbusinesscourse.com">hello@newbusinesscourse.com</a>
        </p>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-[13px]">
          <Link to="/terms" className="text-navy font-semibold hover:text-gold">
            Terms of Service →
          </Link>
          <Link to="/refund-policy" className="text-navy font-semibold hover:text-gold">
            Refund Policy →
          </Link>
          <Link to="/contact" className="text-navy font-semibold hover:text-gold">
            Contact us →
          </Link>
        </div>
      </section>
    </>
  );
}
