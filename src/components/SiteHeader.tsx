import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links: ReadonlyArray<{ to: string; label: string; end?: boolean }> = [
  { to: "/", label: "Home", end: true },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/cpa-consultation", label: "CPA Call" },
  { to: "/refer", label: "Refer & Earn" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `relative text-[14px] transition-colors ${
                  isActive
                    ? "text-navy font-semibold"
                    : "font-medium text-muted-foreground hover:text-navy"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/curriculum"
            className="btn-gold hover:btn-gold-hover min-h-0! py-2.5! px-5! text-[13px]!"
          >
            Get started
            <ArrowRight size={14} />
          </Link>
        </div>
        <button
          aria-label="Menu"
          className="md:hidden p-2 text-navy"
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[15.5px] font-semibold text-navy"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.25 }}
              >
                <Link
                  to="/curriculum"
                  onClick={() => setOpen(false)}
                  className="btn-gold hover:btn-gold-hover w-full mt-2"
                >
                  Get started
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
