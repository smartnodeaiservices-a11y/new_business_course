import { motion } from "motion/react";
import { ArrowRight, Check, Shield, TrendingUp } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import {
  CurriculumSection,
  FaqSection,
  FinalCtaSection,
  GuaranteeSection,
  InstructorSection,
  TestimonialsSection,
} from "@/components/LandingSections";
import { usePageMeta } from "@/lib/page-meta";

const VARIANT = "lp-v3";
const COURSE = "foundations-playbook";
const PRICE = "$149";
const VIDEO_ID = "1Qq-80kexYciCPY3kiTOTaogqKGuxWB69";

const MATH = [
  { line: "Average year-1 tax savings", value: "$20,400" },
  { line: "Course price (one-time)", value: "−$149" },
  { line: "Net year-1 ROI", value: "13,591%", highlight: true },
];

const COMPARE = [
  {
    label: "1-hour CPA consult",
    price: "$400–$650",
    body: "One question answered. No system. No follow-up. Repeat next quarter.",
  },
  {
    label: "Fractional CFO retainer",
    price: "$2,500/mo",
    body: "$30K/yr. Powerful if you're at $1M+ revenue. Overkill if you're just starting.",
  },
  {
    label: "Foundations Playbook",
    price: `${PRICE} once`,
    body: "Every fix, every action item, every handout. Yours forever. Updated every year.",
    highlight: true,
  },
];

export default function LandingV3() {
  usePageMeta({
    title: "$149 → $20,400 year-1 savings. Do the math.",
    description:
      "The Foundations Playbook is a one-time $149 — average year-one savings: $20,400. CPA-built. 30-day refund.",
  });

  return (
    <>
      {/* Hero — pure math */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-(--gold)/8 blur-[100px]" />
        </div>
        <div className="relative max-w-[1100px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="chip mb-5">
              <TrendingUp size={14} />
              Average year-1 savings: $20,400
            </span>
            <h1 className="text-[clamp(2.25rem,5vw+0.5rem,4rem)]! leading-[1.02]! mb-5 max-w-3xl mx-auto">
              Spend <span className="text-gold">{PRICE}</span>.
              <br className="hidden sm:block" /> Keep <span className="text-gold">$20,400</span>.
            </h1>
            <p className="text-[18px] text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-9">
              The Foundations Playbook is a one-time {PRICE}. The average owner who
              applies even one module recoups it more than 130 times over in year one.
              That's not a typo.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-md mx-auto mb-10"
            >
              <div className="card-base p-6 text-left bg-warm-white">
                {MATH.map((row) => (
                  <div
                    key={row.line}
                    className={`flex items-baseline justify-between py-2.5 ${
                      row.highlight
                        ? "border-t-2 border-gold mt-1 pt-4"
                        : "border-b border-(--border)/60"
                    }`}
                  >
                    <span className="text-[14px] text-muted-foreground">
                      {row.line}
                    </span>
                    <span
                      className={`tabular-nums ${
                        row.highlight
                          ? "text-[28px] font-bold text-gold"
                          : "text-[18px] font-semibold text-navy"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}`}
                className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
              >
                Enroll · {PRICE}
                <ArrowRight size={17} />
              </a>
              <span className="text-[13px] text-muted-foreground inline-flex items-center gap-1.5">
                <Shield size={14} className="text-gold" />
                30-day refund · Find $2K+ or full refund
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-warm-white border-y border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow mb-3">How it compares</p>
            <h2 className="text-[28px]! mb-3">Three ways to fix this. One that scales.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {COMPARE.map((c) => (
              <div
                key={c.label}
                className={`card-base p-6 ${
                  c.highlight
                    ? "border-gold ring-2 ring-(--gold)/30 bg-white"
                    : ""
                }`}
              >
                <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {c.label}
                </p>
                <p
                  className={`text-[22px] font-bold mb-3 tabular-nums ${
                    c.highlight ? "text-gold" : "text-navy"
                  }`}
                >
                  {c.price}
                </p>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video + form */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">Watch the intro · 2 min</p>
            <h2 className="text-[28px]! mb-5">See where the math comes from.</h2>
            <VideoEmbed fileId={VIDEO_ID} title="Foundations Playbook — Intro" />
            <ul className="mt-6 space-y-2.5">
              {[
                "$4K–$11K saved by choosing the right entity election",
                "$1.2K+ avoided in IRS underpayment penalties",
                "$5K+ deferred into retirement deductions year-one",
                "All built into 4 self-paced modules + CPA handouts",
              ].map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-[14.5px] text-foreground"
                >
                  <Check size={16} className="text-gold mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:sticky lg:top-24">
            <LandingLeadForm
              variant={VARIANT}
              courseSlug={COURSE}
              title={`Lock it in — ${PRICE} one-time`}
              subtitle="Receipt + first module handout hit your inbox within 60 seconds."
            />
          </div>
        </div>
      </section>

      <CurriculumSection tone="warm" />
      <TestimonialsSection tone="light" />
      <InstructorSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection
        variant={VARIANT}
        courseSlug={COURSE}
        price={PRICE}
        headline={`${PRICE} → $20,400. The math doesn't lie.`}
        body="One-time payment. Lifetime access. Updated every year. The average year-one return is 130x the course price."
      />
    </>
  );
}
