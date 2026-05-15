import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Shield, Sparkles } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
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

const VARIANT = "lp-v5";
const COURSE = "foundations-playbook";
const PRICE = "$149";

type Stage = "pre-llc" | "new-owner" | "growing" | "scaling";

const STAGES: Array<{ id: Stage; label: string; sub: string }> = [
  { id: "pre-llc", label: "I haven't formed yet", sub: "Sole prop, side hustle, planning the leap" },
  { id: "new-owner", label: "Formed in the last 24 months", sub: "LLC or S-Corp · still figuring out tax / books" },
  { id: "growing", label: "2–5 years in", sub: "Revenue growing · ready for advanced strategy" },
  { id: "scaling", label: "5+ years · scaling", sub: "Multi-entity · exit planning on the horizon" },
];

const STAGE_PITCH: Record<Stage, { headline: string; lines: string[] }> = {
  "pre-llc": {
    headline: "You'll save the most by starting right.",
    lines: [
      "Pick the right entity (LLC / S-Corp / C-Corp) before you file",
      "Avoid the $5K+ setup mistakes most new owners make",
      "Lock in tax elections that save thousands year-one",
    ],
  },
  "new-owner": {
    headline: "You're sitting on the biggest year-one tax wins.",
    lines: [
      "S-Corp election walkthrough (worth $4K–$11K/yr for most)",
      "Clean up books that survive any audit",
      "Quarterly estimates done once, automated forever",
    ],
  },
  growing: {
    headline: "The Foundations Playbook tightens the base — then plug into advanced.",
    lines: [
      "Make sure foundations aren't quietly leaking money",
      "Set up retirement deferrals you've outgrown the basic IRA on",
      "Bundle with advanced tax strategy to compound year-2 savings",
    ],
  },
  scaling: {
    headline: "Most owners at your stage skip foundations. Don't.",
    lines: [
      "Audit your entity stack for protection + tax efficiency",
      "Asset-protection modules pay for themselves on any single claim",
      "Sets you up for the Exit Planning course cleanly",
    ],
  },
};

export default function LandingV5() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage | null>(null);

  usePageMeta({
    title: "Which $149 course saves you the most? — Take the 30-second quiz",
    description:
      "Answer one question. We'll show you the exact course built for your stage — and the year-one savings range.",
  });

  return (
    <>
      {/* Hero — interactive */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-warm-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="chip mb-5">
              <Sparkles size={14} />
              30-second quiz · No email needed
            </span>
            <h1 className="text-[clamp(2rem,4.5vw+0.5rem,3.6rem)]! leading-[1.05]! mb-5">
              Which {PRICE} course will save you the most?
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Pick where you are right now. We'll show you exactly which module pays for
              itself first — and the year-one savings range we see for owners like you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {STAGES.map((s) => {
              const selected = stage === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStage(s.id)}
                  className={`card-base p-5 text-left transition-all ${
                    selected
                      ? "border-gold ring-2 ring-(--gold)/30 bg-white"
                      : "hover:border-(--gold)/40 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected
                          ? "border-gold bg-gold"
                          : "border-border"
                      }`}
                    >
                      {selected && (
                        <Check size={12} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-navy mb-0.5">
                        {s.label}
                      </p>
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                        {s.sub}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personalized result */}
      <AnimatePresence mode="wait">
        {stage && (
          <motion.section
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="bg-navy text-white"
          >
            <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
                <div>
                  <p className="eyebrow mb-3 text-gold!">Your personalized result</p>
                  <h2 className="text-white text-[30px]! md:text-[36px]! mb-5 leading-[1.1]!">
                    {STAGE_PITCH[stage].headline}
                  </h2>
                  <ul className="space-y-3 mb-7">
                    {STAGE_PITCH[stage].lines.map((l) => (
                      <li
                        key={l}
                        className="flex items-start gap-3 text-white/85 text-[15px] leading-relaxed"
                      >
                        <div className="w-5 h-5 rounded-full bg-(--gold)/15 border border-(--gold)/40 flex items-center justify-center mt-0.5 shrink-0">
                          <Check size={12} className="text-gold" strokeWidth={3} />
                        </div>
                        {l}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}&stage=${stage}`,
                      )
                    }
                    className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
                  >
                    Enroll · {PRICE} one-time
                    <ArrowRight size={17} />
                  </button>
                  <p className="mt-4 text-[12.5px] text-white/55 inline-flex items-center gap-1.5">
                    <Shield size={12} className="text-gold" />
                    30-day money-back guarantee
                  </p>
                </div>
                <div>
                  <VideoEmbed src={HERO_VSL_VIDEO_URL} poster={HERO_VSL_POSTER_URL} title="Foundations Playbook — Intro" vsl />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Static below-fold fallback so even no-quiz visitors see the offer */}
      {!stage && (
        <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <VideoEmbed src={HERO_VSL_VIDEO_URL} poster={HERO_VSL_POSTER_URL} title="Foundations Playbook — Intro" vsl />
            <div>
              <p className="eyebrow mb-3">Or skip the quiz</p>
              <h2 className="text-[26px]! mb-4">
                Foundations Playbook — {PRICE} one-time.
              </h2>
              <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-5">
                The starting course every U.S. business owner should run first. 4 modules,
                CPA handouts, action item per module.
              </p>
              <a
                href={`/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}`}
                className="btn-gold hover:btn-gold-hover min-h-[50px]! px-7!"
              >
                Enroll · {PRICE}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      )}

      <AsSeenOnSection tone="navy" seed={55} />
      <CurriculumSection tone="light" />
      <ModulesAndHandoutsSection tone="warm" />
      <CaseStudiesSection tone="light" />
      <TestimonialsSection tone="light" />
      <InstructorSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection
        variant={VARIANT}
        courseSlug={COURSE}
        price={PRICE}
        headline="Personalized recommendation. Universal foundations."
        body="No matter where you are, the Foundations Playbook is the starting course every U.S. business owner should run first. $149 one-time, lifetime access."
      />
    </>
  );
}
