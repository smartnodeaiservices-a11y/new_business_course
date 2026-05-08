import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "New Business Course — The Smartest $149 You'll Spend" },
      { name: "description", content: "CPA-backed playbook for Florida business owners. 15 modules to keep more profit and avoid costly mistakes. One-time $149." },
      { property: "og:title", content: "The Business Owner Profit Playbook" },
      { property: "og:description", content: "Insider tax strategies & financial systems built by a 20+ year CPA. $20K+ year-one savings potential." },
    ],
  }),
  component: HomePage,
});

const trust = [
  "Built by a 20+ year CPA & CFO",
  "15 focused modules",
  "$20K–$80K+ potential annual impact",
  "Florida-specific strategies",
  "Lifetime access",
];

function HomePage() {
  return (
    <>
      <div className="bg-[var(--alert)] text-white text-center text-[12px] font-medium tracking-wide py-2.5 px-4">
        ⚑ Limited access: $149 one-time payment — no subscription, no upsells, instant access
      </div>

      {/* Hero */}
      <section className="relative bg-[var(--navy)] text-white px-6 md:px-10 pt-24 pb-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 18% 70%, rgba(201,146,42,0.12) 0%, transparent 55%), radial-gradient(circle at 82% 18%, rgba(201,146,42,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="eyebrow flex items-center justify-center gap-3 mb-5">
            <span className="w-7 h-px bg-[var(--gold)]/50" />
            CPA-Backed · 20+ Years · Florida-Specific
            <span className="w-7 h-px bg-[var(--gold)]/50" />
          </p>
          <h1 className="font-display italic font-thin text-[44px] sm:text-[58px] leading-[1.05] text-white mb-2">
            The smartest $149 you'll spend
          </h1>
          <p className="font-display text-[18px] sm:text-[22px] uppercase tracking-[0.06em] text-[var(--gold)]/90 mb-8">
            on your new business
          </p>
          <p className="text-[17px] text-white/65 max-w-xl mx-auto mb-10 leading-relaxed">
            Insider tax strategies and financial systems used by top CPAs — to help you
            keep more profit and make smarter decisions from day one.
          </p>

          <div className="inline-flex flex-col items-center mb-8">
            <div className="flex items-start">
              <span className="font-display text-[28px] text-white/50 mt-2">$</span>
              <span className="font-display font-light text-[72px] leading-none text-white">149</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/40 mt-1">
              One-time · Instant access · No subscription
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/enroll" className="btn-primary hover:btn-primary-hover min-w-[260px]">
              Enroll Now — $149
            </Link>
            <Link
              to="/assessment"
              className="text-white/70 hover:text-white text-sm font-medium underline underline-offset-4 decoration-[var(--gold)]/60"
            >
              Take the free 60-second assessment →
            </Link>
          </div>
          <p className="text-[12px] text-white/35 mt-5">
            30-day guarantee: uncover $2,000+ in savings or full refund · Stripe & PayPal accepted
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[var(--navy)] border-t border-white/10 px-6 py-7">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
          {trust.map((t) => (
            <div key={t} className="flex items-center gap-2.5 text-[13px] font-medium text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Three pillars */}
      <section className="max-w-[1140px] mx-auto px-6 md:px-10 py-24">
        <div className="max-w-xl">
          <p className="eyebrow mb-3">The Playbook</p>
          <h2 className="text-[32px] sm:text-[40px] mb-4">
            Three shifts. One complete system.
          </h2>
          <div className="w-10 h-0.5 bg-[var(--gold)]/60 mb-6" />
          <p className="text-[var(--muted-foreground)]">
            Every module is engineered to fix the foundation, take control of your taxes,
            and build real, lasting wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              n: "01",
              t: "Fix the Foundation",
              d: "Set up your entity, books, and financial infrastructure correctly from day one — so nothing leaks.",
            },
            {
              n: "02",
              t: "Take Control of Your Taxes",
              d: "Plan during the year, not after. Capture every legal deduction. Stop overpaying for good.",
            },
            {
              n: "03",
              t: "Build & Protect Real Wealth",
              d: "Use your business to fund retirement, protect assets, and structure for a tax-efficient exit.",
            },
          ].map((p) => (
            <div key={p.n} className="bg-white border border-[var(--surface)] rounded-md p-7">
              <span className="font-display text-[32px] text-[var(--gold)]">{p.n}</span>
              <h3 className="text-[22px] mt-2 mb-3">{p.t}</h3>
              <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Savings CTA strip */}
      <section className="bg-[var(--gold-subtle)] border-y border-[var(--gold-tint)] px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-3">Estimated Year-1 Impact</p>
          <h2 className="font-display italic font-thin text-[42px] sm:text-[54px] leading-[1.1] mb-4">
            $20,000+ in your pocket
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-lg mx-auto mb-8">
            Based on CPA-documented strategies across 15 modules. See exactly how much
            you could be leaving on the table.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/course" className="btn-navy">See the full curriculum</Link>
            <Link to="/assessment" className="inline-flex items-center justify-center px-6 py-4 text-[14px] font-semibold tracking-[0.06em] uppercase text-[var(--navy)] border border-[var(--navy)]/20 rounded-md hover:bg-white">
              Free assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-[900px] mx-auto px-6 py-24 text-center">
        <p className="eyebrow mb-3">The Promise</p>
        <h2 className="text-[32px] sm:text-[42px] mb-5">
          You've already built something valuable.
          <br />
          <em className="font-light">Now run it like it's worth millions.</em>
        </h2>
        <p className="text-[var(--muted-foreground)] max-w-xl mx-auto mb-8">
          Complete the course, apply what's relevant, and if you don't uncover at least
          $2,000 in potential savings — we'll refund you in full.
        </p>
        <Link to="/enroll" className="btn-primary hover:btn-primary-hover">
          Enroll Now — $149
        </Link>
      </section>
    </>
  );
}
