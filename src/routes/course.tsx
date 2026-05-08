import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/course")({
  head: () => ({
    meta: [
      { title: "The Course — 15 Modules · Real Strategies · Thousands Saved" },
      { name: "description", content: "Inside the Business Owner Profit Playbook: 15 CPA-built modules covering setup, taxes, payroll, asset protection and exit strategy." },
      { property: "og:title", content: "The Savings Stack — 15 Modules" },
      { property: "og:description", content: "From entity setup through business exit. Year-1 savings of $20K+ documented per IRS guidance." },
    ],
  }),
  component: CoursePage,
});

const modules = [
  ["First-Year Setup", "Set up correctly from day one → capture startup costs, avoid cleanup later", "$5K – $15K", "IRS Pub. 535"],
  ["Business Entity", "Reduce self-employment tax through proper structure", "$12K – $20K+", "IRS FS-2008-25"],
  ["Financial Infrastructure", "Clean books + separation → stop missing deductions", "$4K – $10K", "IRS Pub. 583"],
  ["Business Financials", "Understand your numbers → make better decisions", "$5K – $20K", "SBA Learning Ctr."],
  ["Pay Yourself", "Right salary vs distributions → maximize savings, stay compliant", "$10K – $18K", "IRS Pub. 15-B"],
  ["Payroll & Contractors", "Correct classifications → avoid IRS penalties + back taxes", "$15K – $30K+ avoided", "IRS Pub. 15-A"],
  ["Sales Tax", "Understand nexus + register properly → avoid multi-state exposure", "$5K – $25K+ avoided", "Wayfair Decision"],
  ["Tax Deductions", "Track and claim what most owners miss", "$6K – $20K", "IRS Sec. 162"],
  ["Tax Planning", "Plan during the year, not after → reduce total tax liability", "$8K – $20K", "IRS Pub. 17"],
  ["Year-End Planning", "Control timing of income + expenses before Dec 31", "$8K – $25K+", "IRS Pub. 946"],
  ["Health Insurance", "Structure premiums correctly → reduce after-tax cost", "$4K – $12K", "IRS Pub. 535"],
  ["Retirement & Wealth", "Use business to fund tax-advantaged accounts", "$15K – $35K+", "IRS Pub. 560"],
  ["Business Credit", "Access better capital → lower interest, better terms", "$5K – $25K+ lifetime", "SBA.gov"],
  ["Asset Protection", "Separate risk + protect assets properly", "$100K – $500K risk avoided", "SBA"],
  ["Business Exit", "Structure early → reduce or eliminate taxes at sale", "Up to $10M exclusion", "IRS QSBS §1202"],
];

const included = [
  ["Video Lessons", "Clear, real-world explanations — so you understand what to do and why."],
  ["Slide Decks", "Structured visuals you can refer back to anytime."],
  ["Tools & Resource Handouts", "The exact tools and references used by working CPAs."],
  ["Step-by-Step Action Items", "Know exactly what to do next after every unit."],
  ["Lifetime Access", "Come back any time as your business evolves."],
  ["Self-Paced Learning", "Move at your own pace. Revisit any unit on demand."],
];

function CoursePage() {
  return (
    <>
      <section className="bg-[var(--navy)] text-white px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3">The Savings Stack</p>
          <h1 className="text-white text-[40px] sm:text-[52px] mb-4">
            15 modules. Real strategies.
            <br />
            <em className="font-light text-[var(--gold)]">Thousands saved.</em>
          </h1>
          <p className="text-white/55 max-w-xl">
            Every step in this course is designed to save you money, reduce risk, and
            build long-term wealth — backed by IRS publications and decades of CPA practice.
          </p>
        </div>
      </section>

      {/* Modules table */}
      <section className="max-w-[1140px] mx-auto px-6 md:px-10 py-20">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div className="border border-[var(--surface)] rounded-lg overflow-hidden bg-white">
            <div className="hidden md:grid grid-cols-[1.2fr_2fr_1fr_1fr] bg-[var(--gold-subtle)] px-5 py-3 gap-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--navy)]">
              <span>Module</span>
              <span>What you get</span>
              <span>Potential impact</span>
              <span>Source</span>
            </div>
            {modules.map(([n, d, i, s]) => (
              <div
                key={n}
                className="grid md:grid-cols-[1.2fr_2fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-t border-[var(--surface)] hover:bg-[var(--gold-subtle)]/50 transition-colors"
              >
                <span className="font-semibold text-[14px] text-[var(--navy)]">{n}</span>
                <span className="text-[13px] text-[var(--muted-foreground)] leading-snug">{d}</span>
                <span className="text-[13px] font-semibold text-[var(--gold)]">{i}</span>
                <span className="text-[12px] text-[var(--muted-foreground)]">{s}</span>
              </div>
            ))}
            <p className="px-5 py-4 border-t border-[var(--surface)] bg-[var(--gold-subtle)]/40 text-[13px] italic text-[var(--muted-foreground)]">
              Real, repeatable strategies used by CPAs every day to help business owners keep more of what they earn.
            </p>
          </div>

          <aside className="grid gap-3 lg:sticky lg:top-24">
            {[
              { l: "Year 1 conservative", n: "$20,000+", s: "Direct tax + efficiency savings" },
              { l: "5-year cumulative", n: "$150,000+", s: "Compounded savings + protected exposure" },
              { l: "Risk eliminated", n: "$50,000+", s: "Lawsuit, audit, back-tax risk reduced" },
              { l: "Total potential", n: "$20K–$80K+", s: "Per year, CPA-documented", hl: true },
            ].map((c) => (
              <div
                key={c.l}
                className={`rounded-lg p-5 border ${
                  c.hl
                    ? "bg-[var(--gold-subtle)] border-[var(--gold)]"
                    : "bg-white border-[var(--surface)]"
                }`}
              >
                <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--muted-foreground)] mb-1">
                  {c.l}
                </p>
                <p className={`font-display font-light text-[34px] leading-none ${c.hl ? "text-[var(--gold)]" : "text-[var(--navy)]"}`}>
                  {c.n}
                </p>
                <p className="text-[12px] text-[var(--muted-foreground)] mt-2">{c.s}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white border-y border-[var(--surface)] px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3">What's Included</p>
          <h2 className="text-[32px] sm:text-[40px] mb-4">A complete system in every unit.</h2>
          <p className="text-[var(--muted-foreground)] max-w-lg mb-10">
            Not a recording dump. Each module is structured so you can take action immediately.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map(([t, d]) => (
              <div key={t} className="bg-[var(--surface)]/60 rounded-md p-6 flex gap-4 items-start">
                <span className="w-6 h-6 rounded-full bg-[var(--gold-tint)] border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] text-xs font-bold">✓</span>
                <div>
                  <h3 className="text-[16px] font-semibold text-[var(--navy)] font-sans mb-1">{t}</h3>
                  <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[28px] sm:text-[36px] mb-6">Ready to keep more of what you earn?</h2>
        <Link to="/enroll" className="btn-primary hover:btn-primary-hover">Enroll Now — $149</Link>
      </section>
    </>
  );
}
