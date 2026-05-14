import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";

export default function TermsPage() {
  usePageMeta({
    title: "Terms of Service — New Business Course",
    description:
      "The terms that govern your use of NewBusinessCourse.com and any course you purchase from us.",
  });
  return (
    <>
      <section className="bg-navy text-white px-6 md:px-10 py-16">
        <div className="max-w-[860px] mx-auto">
          <p className="eyebrow mb-3 text-gold!">Legal</p>
          <h1 className="text-white mb-3">Terms of Service</h1>
          <p className="text-white/60 text-[14px]">
            Effective Date: March 17, 2026 · Last Updated: April 8, 2026
          </p>
        </div>
      </section>

      <section className="max-w-[860px] mx-auto px-6 md:px-10 py-14 legal-prose">
        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms govern your use of NewBusinessCourse.com and any course you
          purchase from us. By accessing the site or enrolling in a course, you consent
          to these conditions — including the arbitration and class action waivers in
          Sections 14–15.
        </p>

        <h2>2. Course License</h2>
        <p>
          Purchasers receive a limited, non-exclusive, non-transferable, personal license
          to use course materials for personal educational purposes only. Prohibited
          activities include sharing credentials, reselling content, screen-recording,
          creating competing products, and removing branding. Violations result in
          immediate access termination without refund and may carry legal consequences.
        </p>

        <h2>3. Payment &amp; Pricing</h2>
        <p>
          Payments are processed through Stripe in U.S. dollars at the time of purchase.
          We reserve the right to modify pricing for future courses. Promotional pricing
          is temporary and subject to change without advance notice.
        </p>

        <h2>4. Refund Policy</h2>
        <p>
          A 30-day money-back guarantee applies to all purchases. Refund requests require
          emailing <a href="mailto:hello@newbusinesscourse.com">hello@newbusinesscourse.com</a>{" "}
          with order details. Processing takes 5–10 business days to the original payment
          method. After 30 days, refunds are denied. Course access is revoked upon
          reimbursement. See the full{" "}
          <Link to="/refund-policy" className="underline">Refund Policy</Link> for eligibility details.
        </p>

        <h2>5. Course Access &amp; Updates</h2>
        <p>
          Courses typically provide lifetime access after purchase. We may update content
          to reflect legal, tax, or regulatory changes. Significant modifications warrant
          reasonable advance notice to students. Course discontinuation requires a
          minimum 30-day advance notice.
        </p>

        <h2>6. Availability, Errors, and Inaccuracies</h2>
        <p>
          We continuously update content and pricing. Information may contain errors or
          become outdated. We reserve the right to correct mistakes and modify
          pricing/availability without notice, including canceling orders affected by
          pricing errors.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          All course materials, graphics, video, and audio remain the property of
          NewBusinessCourse.com or our licensors, protected by copyright and trademark
          law. Purchasers obtain only a personal access license without ownership
          transfer. Unauthorized use may trigger legal action including statutory damages
          and attorney fees.
        </p>

        <h2>8. User Conduct</h2>
        <p>
          You must not violate laws, infringe intellectual property, upload malware, gain
          unauthorized system access, disrupt platform performance, misrepresent your
          identity, or harvest user information without consent.
        </p>

        <h2>9. Testimonials &amp; Results Disclaimer</h2>
        <p>
          Featured testimonials represent motivated, high-performing individuals and are
          not typical outcomes. We make no guarantees regarding financial results, income
          levels, or tax savings. No earnings claims are made. Results vary by
          background, effort, and external factors. Testimonials are voluntary, real
          student experiences and are compensated only when disclosed.
        </p>

        <h2>10. Educational Disclaimer</h2>
        <p>
          Course content provides educational information only — not legal, tax,
          financial, or professional advice. We employ no licensed attorneys, CPAs, or
          financial advisors in the capacity of advising you personally. Laws and
          regulations vary by jurisdiction and change frequently. Consult qualified
          professionals before making business decisions. We disclaim liability for
          relying on course content as professional guidance.
        </p>

        <h2>11. Disclaimer of Warranties</h2>
        <p>
          Services are provided "as is" without implied or express warranties regarding
          merchantability or fitness. We do not warrant uninterrupted service, accuracy,
          security, or current legal compliance in all content.
        </p>

        <h2>12. Limitation of Liability</h2>
        <p>
          NewBusinessCourse.com and associated parties are not liable for indirect,
          consequential, or punitive damages, including profit loss or business
          opportunity harm. Aggregate liability is capped at amounts paid within the
          preceding 12 months.
        </p>

        <h2>13. Indemnification</h2>
        <p>
          You agree to indemnify NewBusinessCourse.com against claims arising from your
          Terms violations, law violations, third-party right infringements, or any
          content you submit.
        </p>

        <h2>14. Mandatory Arbitration</h2>
        <p>
          Disputes resolve through binding individual arbitration under American
          Arbitration Association Consumer Rules in Florida or by remote agreement. The
          arbitrator's decision becomes final and enforceable. Arbitration covers all
          claims — contract, tort, statute, fraud, or misrepresentation. Small claims
          court remains available for eligible disputes. Either party may seek emergency
          injunctive relief for intellectual property threats. Filing fees follow AAA
          rules; for claims under $10,000, we cover fees unless the arbitrator deems the
          claim frivolous.
        </p>

        <h2>15. Class Action Waiver</h2>
        <p>
          Both parties waive jury trial and class action rights. Disputes proceed
          individually only; arbitrators cannot consolidate multiple claims or preside
          over class proceedings. If courts void this waiver, arbitration becomes null
          and claims proceed in Florida courts.
        </p>

        <h2>16. Governing Law</h2>
        <p>
          Florida law governs these Terms without conflict-of-law application. You
          consent to Florida state and federal court jurisdiction. Parties must attempt
          informal dispute resolution via{" "}
          <a href="mailto:hello@newbusinesscourse.com">hello@newbusinesscourse.com</a>{" "}
          within 30 days before legal proceedings.
        </p>

        <h2>17. Changes to These Terms</h2>
        <p>
          We may modify these Terms at any time, updating the "Last Updated" date and
          notifying customers by email at least 14 days before changes take effect.
          Continued use indicates acceptance. For changes to arbitration or class action
          provisions, you receive notice and 30 days to opt out via email without
          affecting other provisions.
        </p>

        <h2>18. Severability &amp; Entire Agreement</h2>
        <p>
          Invalid provisions are limited minimally; remaining provisions persist. These
          Terms together with the Privacy Policy constitute the complete agreement.
        </p>

        <h2>19. Affiliate Relationships &amp; Commission Disclosure</h2>
        <p>
          Per FTC guidelines, we disclose third-party compensation relationships.
          Affiliate links may generate commissions without affecting consumer prices. We
          maintain affiliate relationships with business formation, accounting, payroll,
          and legal service providers. Recommendations remain independent despite
          affiliate status. We operate an affiliate program through which third parties
          earn purchase-based commissions while complying with FTC disclosure
          requirements. Third-party claims inconsistent with official materials are
          unauthorized. Affiliate relationships change without notice.
        </p>

        <h2>20. Contact Information</h2>
        <p>
          <strong>General Inquiries:</strong>{" "}
          <a href="mailto:hello@newbusinesscourse.com">hello@newbusinesscourse.com</a>
          <br />
          <strong>Privacy Concerns:</strong>{" "}
          <a href="mailto:privacy@newbusinesscourse.com">privacy@newbusinesscourse.com</a>
        </p>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-[13px]">
          <Link to="/privacy" className="text-navy font-semibold hover:text-gold">
            Privacy Policy →
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
