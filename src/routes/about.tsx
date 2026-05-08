import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Why This Course — Built by a 20+ Year CPA" },
      { name: "description", content: "Not theory. A complete system built from 20+ years as a CPA and 15+ years as a CFO helping thousands of business owners." },
      { property: "og:title", content: "Why This Course — New Business Course" },
      { property: "og:description", content: "Real strategies from real client situations. Built by a CPA firm. Trusted by Florida business owners." },
    ],
  }),
  component: AboutPage,
});

const before = [
  "Making decisions that impact your money — without fully understanding what's driving your numbers.",
  "Dealing with taxes once a year — discovering what you owe when there's nothing left you can do.",
  "Looking at your numbers — but can't confidently say they're accurate or what they're telling you.",
  "Relying on professionals — but can't tell when something is being missed or costing you money.",
];
const after = [
  "Understand exactly how your business is structured — and where money is being lost right now.",
  "Make decisions during the year — reduce taxes by implementing the right strategies in real time.",
  "Read your financials, immediately spot what's off — and know exactly what to fix.",
  "Know when professional advice is solid — and when it's costing you money.",
];
const result = [
  "Stop quietly overpaying — keep thousands more in your pocket every year.",
  "Avoid mistakes, surprises, and missed opportunities — your bottom line gets stronger.",
  "Operate with clarity and control — every decision pushes the business forward.",
  "Build a business that doesn't just generate income — it builds real, lasting wealth.",
];

const reasons = [
  ["Built from real client situations", "Each unit was created from real mistakes and questions that come up for owners again and again."],
  ["Full financial lifecycle", "From setup, to scaling, through exit — every stage of your business is covered."],
  ["Professional-grade resources", "Each unit includes handouts with the exact tools real CPAs use with clients."],
  ["Knowledge to challenge advice", "Stop relying blindly on professionals — know what's right for your business."],
  ["Beyond the bookkeeper bottleneck", "You didn't go into business to do bookkeeping. Learn what to hand off and when."],
  ["Trusted at scale", "Strategies used to help thousands of business owners structure, protect, and grow."],
];

function AboutPage() {
  return (
    <>
      <section className="bg-[var(--navy)] text-white px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3">Why This Course</p>
          <h1 className="text-white text-[40px] sm:text-[54px] mb-5 max-w-3xl">
            Built by a <span className="text-[var(--gold)] italic font-light">20+ year CPA.</span>
            <br />
            From real client situations.
          </h1>
          <p className="text-white/55 max-w-2xl text-[17px]">
            Not theory. Not generic advice. A comprehensive system built from 20+ years as a
            CPA and 15+ years as a CFO — helping thousands of business owners keep more
            of what they earn.
          </p>
        </div>
      </section>

      {/* The Shift table */}
      <section className="max-w-[1140px] mx-auto px-6 md:px-10 py-20">
        <div className="max-w-xl mb-10">
          <p className="eyebrow mb-3">The Shift</p>
          <h2 className="text-[32px] sm:text-[40px]">What changes when you actually understand your business.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Column title="Before this course" tone="muted" items={before} />
          <Column title="After this course" tone="success" items={after} />
          <Column title="Real-world impact" tone="gold" items={result} />
        </div>
      </section>

      {/* Reasons */}
      <section className="bg-white border-y border-[var(--surface)] px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3">What Makes It Different</p>
          <h2 className="text-[32px] sm:text-[40px] mb-10 max-w-2xl">
            Six reasons this is the only course you'll need.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map(([t, d], i) => (
              <div key={t} className="border-l-2 border-[var(--gold)] pl-5">
                <p className="font-display text-[22px] text-[var(--navy)] mb-1">0{i + 1}</p>
                <h3 className="text-[16px] font-semibold text-[var(--navy)] font-sans mb-2">{t}</h3>
                <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[var(--navy)] text-white text-center px-6 py-20">
        <div className="max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-[var(--gold)] bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] text-2xl mb-6">↻</div>
          <h2 className="text-white text-[28px] sm:text-[38px] mb-4">
            The investment that pays for itself —
            <em className="font-light text-[var(--gold)]"> or you don't pay.</em>
          </h2>
          <p className="text-white/60 mb-3">
            Even using just one strategy could easily save you more than the course costs in your very first year.
          </p>
          <p className="text-[var(--gold)] font-medium mb-8">
            If you don't uncover at least $2,000 in potential savings, we refund you in full.
          </p>
          <Link to="/enroll" className="btn-primary hover:btn-primary-hover">Enroll Now — $149</Link>
        </div>
      </section>
    </>
  );
}

function Column({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "muted" | "success" | "gold";
  items: string[];
}) {
  const colors = {
    muted: { head: "text-[var(--muted-foreground)] border-[var(--surface)]", border: "border-[var(--surface)]" },
    success: { head: "text-[var(--success)] border-[var(--success)]", border: "border-[var(--success)]/30" },
    gold: { head: "text-[var(--gold)] border-[var(--gold)]", border: "border-[var(--gold)]/40" },
  }[tone];
  return (
    <div>
      <p className={`text-[10px] font-semibold tracking-[0.16em] uppercase pb-2.5 mb-5 border-b-2 ${colors.head}`}>{title}</p>
      <div className="space-y-4">
        {items.map((it, i) => (
          <p key={i} className={`text-[14px] leading-relaxed text-[var(--foreground)] pl-4 border-l-2 ${colors.border}`}>{it}</p>
        ))}
      </div>
    </div>
  );
}
