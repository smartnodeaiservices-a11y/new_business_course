import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";

export default function AccessibilityPage() {
  usePageMeta({
    title: "Accessibility Statement — New Business Course",
    description:
      "Our commitment to making NewBusinessCourse.com accessible to every business owner, including those using assistive technologies.",
  });
  return (
    <>
      <section className="bg-navy text-white px-6 md:px-10 py-16">
        <div className="max-w-[860px] mx-auto">
          <p className="eyebrow mb-3 text-gold!">Legal</p>
          <h1 className="text-white mb-3">Accessibility Statement</h1>
          <p className="text-white/60 text-[14px]">
            Effective Date: March 17, 2026 · Last Updated: April 8, 2026
          </p>
        </div>
      </section>

      <section className="max-w-[860px] mx-auto px-6 md:px-10 py-14 legal-prose">
        <h2>Our Commitment</h2>
        <p>
          NewBusinessCourse.com is committed to making our website and course materials
          accessible to the widest possible audience, including business owners with
          disabilities. We believe everyone deserves equal access to the financial,
          tax, and operational education we provide — regardless of how they interact
          with the web.
        </p>

        <h2>Conformance Status</h2>
        <p>
          We aim to conform with the{" "}
          <a
            href="https://www.w3.org/WAI/standards-guidelines/wcag/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
          </a>
          . These guidelines define how to make web content more accessible for people
          with a wide range of disabilities, including visual, auditory, motor, and
          cognitive impairments. We continuously review and improve our platform to
          meet or exceed this standard.
        </p>

        <h2>Accessibility Features</h2>
        <p>Our website and course platform include the following accessibility features:</p>
        <ul>
          <li>
            <strong>Keyboard navigation</strong> — all interactive elements are reachable
            and operable using only a keyboard
          </li>
          <li>
            <strong>Semantic HTML</strong> — proper heading structure and landmark
            regions for assistive technology
          </li>
          <li>
            <strong>Alternative text</strong> — descriptive alt text on meaningful images
            and decorative markers on non-essential imagery
          </li>
          <li>
            <strong>Color contrast</strong> — text and interactive elements meet or
            exceed WCAG AA contrast ratios
          </li>
          <li>
            <strong>Resizable text</strong> — content remains readable and functional at
            up to 200% zoom
          </li>
          <li>
            <strong>Captions &amp; transcripts</strong> — video lessons include closed
            captions and downloadable transcripts
          </li>
          <li>
            <strong>Screen reader support</strong> — tested with NVDA, JAWS, and VoiceOver
          </li>
          <li>
            <strong>Focus indicators</strong> — visible focus styling on every interactive
            element
          </li>
          <li>
            <strong>Reduced motion</strong> — animations respect the user's
            <code> prefers-reduced-motion</code> setting
          </li>
        </ul>

        <h2>Course Materials</h2>
        <p>
          All downloadable handouts and worksheets are provided in accessible PDF
          formats with proper document structure, tagged headings, and reading order.
          If you encounter a document that doesn't meet your accessibility needs, email
          us and we'll provide an alternate format within 2 business days at no
          additional cost.
        </p>

        <h2>Known Limitations</h2>
        <p>
          Despite our best efforts, some content may not yet be fully accessible. We are
          actively working to address the following:
        </p>
        <ul>
          <li>
            Older video lessons recorded before our captioning standard was implemented
            — these are being re-captioned on a rolling basis
          </li>
          <li>
            Some third-party embeds (payment processor, video player) inherit
            accessibility behavior from the vendor and may have limitations outside our
            direct control
          </li>
        </ul>

        <h2>Assistive Technologies Supported</h2>
        <p>
          Our platform is designed to be compatible with the latest versions of major
          browsers and assistive technologies, including:
        </p>
        <ul>
          <li>Chrome, Firefox, Safari, and Edge (latest two major versions)</li>
          <li>NVDA and JAWS on Windows</li>
          <li>VoiceOver on macOS and iOS</li>
          <li>TalkBack on Android</li>
          <li>Dragon NaturallySpeaking and other voice control software</li>
        </ul>

        <h2>Feedback &amp; Help</h2>
        <p>
          We welcome your feedback on the accessibility of NewBusinessCourse.com. If you
          encounter accessibility barriers or need content provided in an alternate
          format, please contact us:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:accessibility@newbusinesscourse.com">
              accessibility@newbusinesscourse.com
            </a>
          </li>
          <li>
            <strong>General support:</strong>{" "}
            <a href="mailto:hello@newbusinesscourse.com">hello@newbusinesscourse.com</a>
          </li>
          <li>
            <strong>Response timeframe:</strong> within 3 business days
          </li>
        </ul>
        <p>
          When contacting us, please include the page URL, a description of the issue,
          the browser and assistive technology you're using, and what would help resolve
          the barrier. We take every report seriously and prioritize fixes that unblock
          real users.
        </p>

        <h2>Formal Complaints</h2>
        <p>
          If we are unable to resolve your concern, you may file a formal complaint with
          the U.S. Department of Justice under the Americans with Disabilities Act (ADA).
          We hope to address every issue directly first — please reach out so we can
          help.
        </p>

        <h2>Ongoing Improvement</h2>
        <p>
          Accessibility is not a one-time project. We conduct regular audits, run
          automated and manual testing on every new feature, and train our team on
          inclusive design practices. This statement is reviewed and updated quarterly
          to reflect our current status.
        </p>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-[13px]">
          <Link to="/privacy-policy" className="text-navy font-semibold hover:text-gold">
            Privacy Policy →
          </Link>
          <Link to="/terms-of-service" className="text-navy font-semibold hover:text-gold">
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
