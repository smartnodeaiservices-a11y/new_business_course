import { motion } from "motion/react";
import { ArrowRight, Award, Check, Shield, Star } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { HERO_VSL_VIDEO_URL, HERO_VSL_POSTER_URL } from "@/lib/curriculum";
import {
  AsSeenOnSection,
  CaseStudiesSection,
  CurriculumSection,
  FaqSection,
  FinalCtaSection,
  GuaranteeSection,
  InstructorSection,
  ModulesAndHandoutsSection,
  TestimonialsSection,
} from "@/components/LandingSections";
import { usePageMeta } from "@/lib/page-meta";

const VARIANT = "lp-v1";
const COURSE = "foundations-playbook";
const PRICE = "$149";

const PROOF = [
  "Pick the right entity for your situation (LLC vs. S-Corp vs. C-Corp)",
  "Set up your EIN, operating agreement, and books that scale",
  "Avoid the $5K+ setup mistakes most new owners make",
  "Lock in tax elections that save thousands year-one",
];

export default function LandingV1() {
  usePageMeta({
    title: "Watch: How U.S. business owners save $20K+ year one — $149",
    description:
      "Self-paced CPA course. Watch the 2-minute intro and enroll in The Foundations Playbook for $149.",
  });

  return (
    <>
      {/* Hero — VSL is the centerpiece */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-warm-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <span className="inline-flex items-center gap-2 mb-5 chip">
              <Award size={14} />
              Built by a 20+ year practicing CPA
            </span>
            <h1 className="mb-4 text-[clamp(2rem,4vw+0.5rem,3.5rem)]! leading-[1.05]!">
              Watch how owners save{" "}
              <span className="text-gold">$20K+ year one</span>
              <br className="hidden sm:block" /> — for a one-time {PRICE}.
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Press play. The 2-minute video walks through exactly how the Foundations
              Playbook works — and what you'll set up in your first week.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <VideoEmbed
              src={HERO_VSL_VIDEO_URL}
              poster={HERO_VSL_POSTER_URL}
              title="Foundations Playbook — Intro"
              vsl
            />
          </motion.div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}`}
              className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
            >
              Enroll now · {PRICE}
              <ArrowRight size={17} />
            </a>
            <span className="text-[13px] text-muted-foreground inline-flex items-center gap-1.5">
              <Shield size={14} className="text-gold" />
              30-day money-back guarantee
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={13} className="fill-gold text-gold" />
                ))}
              </span>
              <strong className="text-navy">4.9</strong> · 2,500+ owners enrolled
            </span>
            <span>Lifetime access · No subscription</span>
          </div>
        </div>
      </section>

      {/* What you'll set up */}
      <section className="bg-white border-y border-border">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
            <div>
              <p className="eyebrow mb-3">In this {PRICE} course</p>
              <h2 className="mb-3 text-[28px]!">Four modules. Everything you actually need.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Self-paced video lessons + downloadable CPA handouts. Each module ships
                with a step-by-step action item you can implement the same day.
              </p>
            </div>
            <ul className="space-y-3">
              {PROOF.map((p) => (
                <li
                  key={p}
                  className="card-base p-4 flex items-start gap-3 text-[14.5px] text-foreground"
                >
                  <Check size={18} className="text-gold mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA + lead form */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <p className="eyebrow mb-3">Ready to start?</p>
            <h2 className="mb-4 text-[28px]!">
              {PRICE} once. The course you'll wish you took before you started.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              30-day money-back guarantee: find $2K+ in savings or get every cent refunded.
            </p>
            <ul className="space-y-2">
              {["Lifetime access + updates", "Downloadable CPA handouts", "Action item per module"].map(
                (i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[14px] text-foreground"
                  >
                    <Check size={15} className="text-gold" />
                    {i}
                  </li>
                ),
              )}
            </ul>
          </div>
          <LandingLeadForm
            variant={VARIANT}
            courseSlug={COURSE}
            title={`Start the Foundations Playbook — ${PRICE}`}
          />
        </div>
      </section>

      <AsSeenOnSection tone="navy" seed={11} />
      <CurriculumSection tone="light" />
      <ModulesAndHandoutsSection tone="warm" />
      <CaseStudiesSection tone="light" />
      <TestimonialsSection tone="warm" />
      <InstructorSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection
        variant={VARIANT}
        courseSlug={COURSE}
        price={PRICE}
        headline="Press play. Then enroll."
        body="The course pays for itself with a single strategy in any one module. Lifetime access, updated every year as tax law changes."
      />
    </>
  );
}
