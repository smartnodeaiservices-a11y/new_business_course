import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, Check, Shield, X } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import {
  CurriculumSection,
  FaqSection,
  FinalCtaSection,
  GuaranteeSection,
  OutcomesSection,
  TestimonialsSection,
} from "@/components/LandingSections";
import { usePageMeta } from "@/lib/page-meta";

const VARIANT = "lp-v2";
const COURSE = "foundations-playbook";
const PRICE = "$149";
const VIDEO_ID = "1Qq-80kexYciCPY3kiTOTaogqKGuxWB69";

const MISTAKES = [
  {
    title: "Wrong entity election",
    cost: "$4,000–$11,000/yr",
    body: "Filing as a sole prop or default LLC when an S-Corp would have saved 5 figures in self-employment tax.",
  },
  {
    title: "Missed quarterly estimates",
    cost: "$1,200+ in penalties",
    body: "IRS underpayment penalties + state interest. Compounds every year you don't fix it.",
  },
  {
    title: "Mixed personal & business money",
    cost: "$0 — until audit",
    body: "Pierces your LLC liability shield and turns a deductible expense into an IRS argument.",
  },
  {
    title: "No retirement plan in place",
    cost: "$5,000+ in lost deferrals",
    body: "Solo 401(k) / SEP-IRA opens deductions a W-2 employee can never touch.",
  },
];

export default function LandingV2() {
  usePageMeta({
    title: "The 4 tax mistakes costing U.S. owners $20K+ a year — fix them for $149",
    description:
      "Most new owners overpay tax by 5 figures in year one. The Foundations Playbook walks you out of it for a one-time $149.",
  });

  return (
    <>
      {/* Hero — confront the cost */}
      <section className="relative overflow-hidden bg-linear-to-b from-warm-white to-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[12px] font-semibold uppercase tracking-[0.08em]">
              <AlertTriangle size={13} />
              Most owners overpay $20K+ in year one
            </span>
            <h1 className="mb-5 text-[clamp(2rem,4.2vw+0.5rem,3.6rem)]! leading-[1.05]!">
              How much did you{" "}
              <span className="relative inline-block">
                <span className="relative z-10">overpay the IRS</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-(--gold)/30 -z-0" />
              </span>{" "}
              last year?
            </h1>
            <p className="text-[18px] text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              If you've been in business under 24 months, the answer is almost certainly
              "a lot." The Foundations Playbook walks you through every fix — for a
              one-time <strong className="text-navy">{PRICE}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <a
                href={`/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}`}
                className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
              >
                Fix it for {PRICE}
                <ArrowRight size={17} />
              </a>
              <a
                href="#video"
                className="btn-outline hover:btn-outline-hover min-h-[54px]! px-8! text-[15px]!"
              >
                Watch the 2-min intro
              </a>
            </div>
            <p className="text-[12.5px] text-muted-foreground">
              30-day money-back guarantee · Find $2K+ in savings or full refund.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 4 mistakes — pain table */}
      <section className="bg-navy text-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow mb-3 text-gold!">The cost of figuring it out alone</p>
            <h2 className="text-white text-[28px]! md:text-[34px]! mb-3">
              Four mistakes. One audit waiting to happen.
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed">
              Every one of these we've seen dozens of times in real client books. The
              course walks you out of each — with the action item and the CPA handout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {MISTAKES.map((m) => (
              <div
                key={m.title}
                className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-400/30 flex items-center justify-center shrink-0">
                    <X size={18} className="text-red-300" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold whitespace-nowrap">
                    {m.cost}
                  </span>
                </div>
                <h3 className="text-white text-[17px]! mb-1.5">{m.title}</h3>
                <p className="text-[13.5px] text-white/65 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video + offer */}
      <section id="video" className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">Watch the 2-min intro</p>
            <h2 className="text-[28px]! mb-5">See exactly what we fix.</h2>
            <VideoEmbed fileId={VIDEO_ID} title="Foundations Playbook — Intro" />
            <ul className="mt-6 space-y-2.5">
              {[
                "Right entity, right election — no more SE tax bleed",
                "Quarterly estimates done once, automated forever",
                "Clean books that survive any audit",
                "Retirement deferrals most owners never know they qualify for",
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
              title={`Stop overpaying — start at ${PRICE}`}
              subtitle="Enter your details. Receipt + the first handout hit your inbox within 60 seconds."
              ctaLabel={`Enroll · ${PRICE}`}
            />
            <p className="mt-4 text-center text-[12px] text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
              <Shield size={12} className="text-gold" />
              30-day refund · No subscription
            </p>
          </div>
        </div>
      </section>

      <CurriculumSection tone="warm" />
      <OutcomesSection tone="light" />
      <TestimonialsSection tone="warm" />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection
        variant={VARIANT}
        courseSlug={COURSE}
        price={PRICE}
        headline="Stop overpaying the IRS."
        body="Four modules. Four hours. Every fix walked through with a CPA — for less than the cost of an hour with one."
      />
    </>
  );
}
