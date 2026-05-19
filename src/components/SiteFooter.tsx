import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white/70 mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="[&_span]:text-white!">
            <Logo dark />
          </div>
          <p className="mt-5 text-[14.5px] text-white/55 max-w-sm leading-relaxed">
            Self-paced tax & finance courses for U.S. business owners — built by a 20+ year
            practicing CPA. Florida-specific guidance baked into every course.
          </p>
        </div>
        <div>
          <h6 className="text-white/40! text-[11px]! mb-4">Platform</h6>
          <ul className="space-y-2.5 text-[14px]">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-white transition-colors">
                All courses
              </Link>
            </li>
            <li>
              <Link to="/intake" className="hover:text-white transition-colors">
                Find my plan
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-white/40! text-[11px]! mb-4">Legal</h6>
          <ul className="space-y-2.5 text-[14px]">
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-white/40! text-[11px]! mb-4">Trust</h6>
          <ul className="space-y-2.5 text-[14px]">
            <li>20+ years CPA practice</li>
            <li>30-day money-back guarantee</li>
            <li>One-time payment, lifetime access</li>
            <li>newbusinesscourse.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/35">
          <span>© {new Date().getFullYear()} New Business Course</span>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white/70 transition-colors">
              Terms
            </Link>
            <Link to="/refund-policy" className="hover:text-white/70 transition-colors">
              Refunds
            </Link>
            <Link to="/contact" className="hover:text-white/70 transition-colors">
              Contact
            </Link>
            <Link
              to="/admin/analytics"
              className="hover:text-white/70 transition-colors"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
