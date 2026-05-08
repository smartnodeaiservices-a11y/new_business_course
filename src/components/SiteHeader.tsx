import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/course", label: "The Course" },
  { to: "/about", label: "Why This Course" },
  { to: "/assessment", label: "Free Assessment" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[var(--warm-white)]/95 backdrop-blur border-b border-[var(--surface)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] font-medium text-[var(--foreground)]/75 hover:text-[var(--navy)] transition-colors"
              activeProps={{ className: "text-[var(--navy)] font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/enroll"
          className="hidden md:inline-flex items-center justify-center bg-[var(--navy)] text-white px-5 py-2.5 rounded-md text-[12px] font-semibold tracking-[0.06em] uppercase hover:bg-[#243d75] transition-colors"
        >
          Enroll — $149
        </Link>
        <button
          aria-label="Menu"
          className="md:hidden p-2 text-[var(--navy)]"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[var(--surface)] bg-[var(--warm-white)] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm text-[var(--navy)] font-medium">
              {l.label}
            </Link>
          ))}
          <Link to="/enroll" onClick={() => setOpen(false)} className="bg-[var(--navy)] text-white px-5 py-3 rounded-md text-[12px] font-semibold tracking-[0.06em] uppercase text-center">
            Enroll — $149
          </Link>
        </div>
      )}
    </header>
  );
}
