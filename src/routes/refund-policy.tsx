import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";

export default function RefundPolicyPage() {
  usePageMeta({
    title: "Refund Policy — New Business Course",
    description:
      "Our 30-day conditional satisfaction guarantee — eligibility requirements, processing timeframes, and how to request a refund.",
  });
  return (
    <>
      <section className="bg-navy text-white px-6 md:px-10 py-16">
        <div className="max-w-[860px] mx-auto">
          <p className="eyebrow mb-3 text-gold!">Legal</p>
          <h1 className="text-white mb-3">Refund Policy</h1>
          <p className="text-white/60 text-[14px]">
            Effective Date: March 17, 2026 · Last Updated: April 8, 2026
          </p>
        </div>
      </section>

      <section className="max-w-[860px] mx-auto px-6 md:px-10 py-14 legal-prose">
        <h2>Overview</h2>
        <p>
          NewBusinessCourse.com maintains a 30-day conditional satisfaction guarantee on
          course purchases, contingent on meeting specific engagement requirements
          described below.
        </p>

        <h2>Eligibility Requirements</h2>
        <p>Refund requests must be submitted within 30 days of purchase and require:</p>
        <ul>
          <li>Completion of at least 20% of course content</li>
          <li>
            Reasonable evidence of effort through notes, worksheets, or implementation
            attempts
          </li>
          <li>No pattern of refund abuse on the account</li>
        </ul>

        <h2>Non-Refundable Situations</h2>
        <p>Refunds are denied when:</p>
        <ul>
          <li>The request exceeds the 30-day window</li>
          <li>Course completion reaches 80% or higher</li>
          <li>Minimal engagement with the materials is demonstrated</li>
          <li>
            Dissatisfaction concerns topics described in the pre-purchase curriculum
          </li>
          <li>Multiple refund requests indicate policy abuse</li>
          <li>
            Purchase occurred through third-party platforms with their own separate terms
          </li>
        </ul>

        <h2>Course Access Post-Refund</h2>
        <p>
          Upon approval, all access to the course will be permanently revoked, including
          downloaded materials and any future updates. Retaining access after refund
          approval violates the{" "}
          <Link to="/terms" className="underline">Terms of Service</Link>.
        </p>

        <h2>Technical Issues</h2>
        <p>
          Contact support before requesting a refund for technical problems. Documented
          platform failures that prevent access for 72+ consecutive hours may qualify for
          refunds regardless of completion percentage.
        </p>

        <h2>How to Request a Refund</h2>
        <ul>
          <li>
            Contact:{" "}
            <a href="mailto:support@newbusinesscourse.com">
              support@newbusinesscourse.com
            </a>
          </li>
          <li>Response timeframe: 3–5 business days</li>
          <li>Refunds issued to the original payment method only</li>
          <li>Processing time: 5–10 business days post-approval</li>
          <li>No partial refunds, store credits, or extensions are offered</li>
        </ul>

        <h2>Chargebacks</h2>
        <p>
          Filing a payment dispute without first contacting support may result in
          permanent revocation of program access and potential legal action. Please reach
          out — we resolve almost every situation quickly when given the chance.
        </p>

        <h2>Questions?</h2>
        <p>
          Email{" "}
          <a href="mailto:support@newbusinesscourse.com">support@newbusinesscourse.com</a>{" "}
          and a real human will respond within a few business hours.
        </p>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-[13px]">
          <Link to="/privacy" className="text-navy font-semibold hover:text-gold">
            Privacy Policy →
          </Link>
          <Link to="/terms" className="text-navy font-semibold hover:text-gold">
            Terms of Service →
          </Link>
          <Link to="/contact" className="text-navy font-semibold hover:text-gold">
            Contact us →
          </Link>
        </div>
      </section>
    </>
  );
}
