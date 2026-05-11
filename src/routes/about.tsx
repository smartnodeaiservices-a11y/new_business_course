import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/page-meta";

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
  [
    "Built from real client situations",
    "Each unit was created from real mistakes and questions that come up for owners again and again.",
  ],
  [
    "Full financial lifecycle",
    "From setup, to scaling, through exit — every stage of your business is covered.",
  ],
  [
    "Professional-grade resources",
    "Each unit includes handouts with the exact tools real CPAs use with clients.",
  ],
  [
    "Knowledge to challenge advice",
    "Stop relying blindly on professionals — know what's right for your business.",
  ],
  [
    "Beyond the bookkeeper bottleneck",
    "You didn't go into business to do bookkeeping. Learn what to hand off and when.",
  ],
  [
    "Trusted at scale",
    "Strategies used to help thousands of business owners structure, protect, and grow.",
  ],
];

export default function AboutPage() {
  usePageMeta({
    title: "About — Built by a 20+ Year CPA",
    description:
      "Not theory. A complete system built from 20+ years as a CPA and 15+ years as a CFO helping thousands of business owners.",
  });
  return (
    <>
      <section className="bg-navy text-white px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3 text-gold!">About</p>
          <h1 className="text-white mb-5 max-w-3xl">
            Built by a 20+ year CPA. From real client situations.
          </h1>
          <p className="text-white/70 max-w-2xl text-[17px] leading-relaxed">
            Not theory. Not generic advice. A comprehensive system built from 20+ years as a CPA and
            15+ years as a CFO — helping thousands of business owners keep more of what they earn.
          </p>
        </div>
      </section>

      <section className="max-w-[1140px] mx-auto px-6 md:px-10 py-20">
        <div className="max-w-xl mb-10">
          <p className="eyebrow mb-3">The Shift</p>
          <h2 className="mb-3">What changes when you actually understand your business.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Column title="Before this course" tone="muted" items={before} />
          <Column title="After this course" tone="success" items={after} />
          <Column title="Real-world impact" tone="gold" items={result} />
        </div>
      </section>

      <section className="bg-white border-y border-border px-6 md:px-10 py-20">
        <div className="max-w-[1140px] mx-auto">
          <p className="eyebrow mb-3">What Makes It Different</p>
          <h2 className="mb-10 max-w-2xl">Six reasons this is the only system you'll need.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map(([t, d], i) => (
              <div key={t} className="border-l-2 border-gold pl-5">
                <p className="text-[22px] font-bold text-navy mb-1 tabular-nums">
                  0{i + 1}
                </p>
                <h3 className="text-[16px]! mb-2">{t}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white text-center px-6 py-20">
        <div className="max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-gold bg-(--gold)/10 flex items-center justify-center text-gold text-2xl mb-6">
            ↻
          </div>
          <h2 className="text-white mb-4">
            The investment that pays for itself — or you don't pay.
          </h2>
          <p className="text-white/70 mb-3">
            Even using just one strategy could easily save you more than the course costs in your
            very first year.
          </p>
          <p className="text-gold font-medium mb-8">
            If you don't uncover at least $2,000 in potential savings, we refund you in full.
          </p>
          <Link to="/intake" className="btn-gold hover:btn-gold-hover">
            Find my plan
          </Link>
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
    muted: {
      head: "text-muted-foreground border-border",
      border: "border-border",
    },
    success: {
      head: "text-(--success) border-(--success)",
      border: "border-(--success)/30",
    },
    gold: { head: "text-gold border-gold", border: "border-(--gold)/40" },
  }[tone];
  return (
    <div>
      <p
        className={`text-[10px] font-semibold tracking-[0.16em] uppercase pb-2.5 mb-5 border-b-2 ${colors.head}`}
      >
        {title}
      </p>
      <div className="space-y-4">
        {items.map((it, i) => (
          <p
            key={i}
            className={`text-[14px] leading-relaxed text-foreground pl-4 border-l-2 ${colors.border}`}
          >
            {it}
          </p>
        ))}
      </div>
    </div>
  );
}
