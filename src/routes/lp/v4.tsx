import { motion } from "motion/react";
import { ArrowRight, Award, Check, Quote, Shield, Star } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import {
  CurriculumSection,
  FaqSection,
  FinalCtaSection,
  GuaranteeSection,
  InstructorSection,
  OutcomesSection,
} from "@/components/LandingSections";
import { usePageMeta } from "@/lib/page-meta";

const VARIANT = "lp-v4";
const COURSE = "foundations-playbook";
const PRICE = "$149";
const VIDEO_ID = "1Qq-80kexYciCPY3kiTOTaogqKGuxWB69";

const CREDENTIALS = [
  { label: "Years practicing", value: "20+" },
  { label: "Client engagements", value: "1,400+" },
  { label: "Owners enrolled", value: "2,500+" },
  { label: "Average rating", value: "4.9 / 5" },
];

const TESTIMONIALS = [
  {
    quote:
      "Cut my SE tax from $14K to under $5K once I followed the S-Corp module. The course paid for itself 30x in Q1 alone.",
    name: "Marcus L.",
    role: "Construction LLC · Year 2",
    saved: "$9K+ Q1",
  },
  {
    quote:
      "I was about to drop $6K on a CPA retainer. This course taught me what to actually ask for and how to spot when advice is wrong.",
    name: "Priya S.",
    role: "Marketing Consultancy",
    saved: "$6K/yr retainer avoided",
  },
  {
    quote:
      "The asset-protection unit alone changed how I run the business. Five years of compounding savings now ahead of me, not behind.",
    name: "James W.",
    role: "Real Estate LLC · 4 yrs",
    saved: "$22K projected year 1",
  },
];

export default function LandingV4() {
  usePageMeta({
    title: "Built by a 20+ year CPA — $149 one-time. The Foundations Playbook.",
    description:
      "2,500+ owners. 4.9-star rated. Self-paced video course built from 20 years of real client work — $149.",
  });

  return (
    <>
      {/* Hero — founder-led */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-(--gold)/8 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-(--navy)/8 blur-[100px]" />
        </div>

        <div className="relative max-w-[1100px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-14">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="chip mb-5">
                <Award size={14} />
                20+ years CPA · 1,400+ client engagements
              </span>
              <h1 className="mb-5 text-[clamp(2rem,4.5vw+0.5rem,3.6rem)]! leading-[1.05]!">
                The course your CPA would teach you{" "}
                <span className="text-gold">— if they had the time.</span>
              </h1>
              <p className="text-[17px] text-muted-foreground leading-relaxed mb-7 max-w-xl">
                Built from 20+ years of real client situations. 2,500+ U.S. owners
                enrolled. Rated <strong className="text-navy">4.9 stars</strong>.
                One-time {PRICE} — yours for life.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <a
                  href={`/enroll?course=${COURSE}&utm_source=${VARIANT}&variant=${VARIANT}`}
                  className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
                >
                  Enroll · {PRICE}
                  <ArrowRight size={17} />
                </a>
                <a
                  href="#video"
                  className="btn-outline hover:btn-outline-hover min-h-[54px]! px-8! text-[15px]!"
                >
                  Watch intro · 2 min
                </a>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Shield size={14} className="text-gold" />
                30-day money-back guarantee. No questions.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              {CREDENTIALS.map((c) => (
                <div key={c.label} className="card-base p-6 text-center">
                  <p className="text-[34px] font-bold text-navy tabular-nums leading-none mb-1">
                    {c.value}
                  </p>
                  <p className="text-[11.5px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-warm-white border-y border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow mb-3">Owners saying it themselves</p>
            <h2 className="text-[28px]! mb-3">2,500+ owners enrolled. 4.9-star rated.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-base p-6 bg-white">
                <Quote size={22} className="text-(--gold)/40 mb-3" />
                <p className="text-[14.5px] text-foreground leading-relaxed mb-5">
                  "{t.quote}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-[14px] font-semibold text-navy">{t.name}</p>
                  <p className="text-[12.5px] text-muted-foreground mb-2">
                    {t.role}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-gold bg-gold-subtle border border-gold-tint px-2 py-0.5 rounded">
                    <Star size={10} className="fill-current" />
                    {t.saved}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video + form */}
      <section id="video" className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">Hear it from the source</p>
            <h2 className="text-[28px]! mb-5">2 minutes. The whole approach.</h2>
            <VideoEmbed fileId={VIDEO_ID} title="Foundations Playbook — Intro" />
            <ul className="mt-6 space-y-2.5">
              {[
                "Built from real client work — not theory or recycled blog posts",
                "Every module ends with a step-by-step CPA handout",
                "Updated every year as tax law changes — yours forever",
                "Priority email support included",
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
              title={`Enroll today · ${PRICE}`}
            />
          </div>
        </div>
      </section>

      <InstructorSection />
      <CurriculumSection tone="warm" />
      <OutcomesSection tone="light" />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection
        variant={VARIANT}
        courseSlug={COURSE}
        price={PRICE}
        headline="The course your CPA would teach you."
        body="Built from 20+ years of real client work. Yours for $149 one-time, updated every year tax law changes."
      />
    </>
  );
}
