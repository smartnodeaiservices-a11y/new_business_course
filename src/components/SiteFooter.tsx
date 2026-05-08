import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--navy)] text-white/70 mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="[&_span]:!text-white">
            <Logo dark />
          </div>
          <p className="mt-5 text-sm text-white/55 max-w-sm leading-relaxed">
            New Business Course — Powered by experts. Built for starters. The only course built for Florida's newest business owners.
          </p>
        </div>
        <div>
          <h4 className="eyebrow !text-white/40 mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/course" className="hover:text-white">The Course</Link></li>
            <li><Link to="/about" className="hover:text-white">Why This Course</Link></li>
            <li><Link to="/assessment" className="hover:text-white">Free Assessment</Link></li>
            <li><Link to="/enroll" className="hover:text-white">Enroll</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow !text-white/40 mb-4">Trust</h4>
          <ul className="space-y-2.5 text-sm">
            <li>CPA-Backed · 20+ Years</li>
            <li>500,000+ FL owners</li>
            <li>30-day savings guarantee</li>
            <li>newbusinesscourse.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/35">
          <span>© {new Date().getFullYear()} New Business Course</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70">Privacy</a>
            <a href="#" className="hover:text-white/70">Terms</a>
            <a href="#" className="hover:text-white/70">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
