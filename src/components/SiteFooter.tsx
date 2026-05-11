import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white/70 mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 grid gap-10 md:grid-cols-4">
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
            <li>
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin
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
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Terms
            </a>
            <Link to="/contact" className="hover:text-white/70 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
