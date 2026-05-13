import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Award, Check, Clock, FileText, PlayCircle, Shield } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import {
  COURSE_INTRO,
  COURSE_META,
  COURSE_MODULES,
  CPA_CONSULTATION,
} from "@/lib/curriculum";
import { usePageMeta } from "@/lib/page-meta";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export default function CurriculumPage() {
  usePageMeta({
    title: `${COURSE_META.productTitle} — 15 modules · $${COURSE_META.priceCents / 100}`,
    description: `${COURSE_META.brand} — ${COURSE_META.moduleCount} CPA-built modules covering everything a new U.S. business owner needs in year one. ${COURSE_META.price} one-time. ${COURSE_META.guarantee}.`,
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-warm-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-12">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 items-start">
            <motion.div {...fadeUp}>
              <span className="chip mb-5">
                <Award size={12} />
                Built by a CPA firm
              </span>
              <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3.25rem)]! leading-[1.05]!">
                The full course, <span className="text-gold">15 modules</span>.
              </h1>
              <p className="text-[16.5px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
                Watch the overview, then work through the modules in any order you like.
                Each module ships with a video lesson and a downloadable handout linking
                you to the tools and partners we use ourselves.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/enroll?course=new-business-blueprint"
                  className="btn-gold hover:btn-gold-hover px-8! text-[15px]!"
                >
                  Enroll · {COURSE_META.price} one-time
                  <ArrowRight size={16} />
                </Link>
                <Link to="/cpa-consultation" className="btn-outline hover:btn-outline-hover">
                  Or book a CPA call
                </Link>
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-5 inline-flex items-center gap-1.5">
                <Shield size={13} className="text-gold" />
                {COURSE_META.guarantee} · Lifetime access · Updated annually
              </p>
            </motion.div>

            <motion.div {...fadeUp}>
              <div className="card-base p-5 md:p-6 bg-gold-subtle border-gold-tint">
                <p className="eyebrow mb-3 text-gold!">Start here</p>
                <h3 className="mb-3">{COURSE_INTRO.title}</h3>
                <VideoEmbed video={COURSE_INTRO.video} title={COURSE_INTRO.title} />
                <p className="text-[14px] text-(--foreground) leading-relaxed mt-4 mb-0">
                  {COURSE_INTRO.summary}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum grid */}
      <section className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">The 15 modules</p>
            <h2 className="text-[28px]! md:text-[32px]! mb-3">
              Everything your accountant wishes you already knew.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Sequential is the recommended path, but the modules are independent — jump
              into whichever applies to your business today.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="grid md:grid-cols-2 gap-3">
            {COURSE_MODULES.map((m) => (
              <Link
                key={m.slug}
                to={`/modules/${m.slug}`}
                className="card-base p-5 bg-white hover:border-gold hover:shadow-[0_10px_30px_rgba(11,26,58,0.08)] block group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-[24px] font-bold text-gold tabular-nums leading-none w-8 shrink-0">
                    {String(m.number).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="m-0! group-hover:text-gold transition-colors">
                        {m.title}
                      </h4>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground group-hover:text-gold transition-colors mt-0.5 shrink-0"
                      />
                    </div>
                    <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0!">
                      {m.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[11.5px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <PlayCircle size={12} />
                        Video lesson
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileText size={12} />
                        Handout + resources
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CPA Consultation add-on */}
      <section className="bg-warm-white border-y border-border">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16">
          <motion.div {...fadeUp} className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <div>
              <p className="eyebrow mb-3">The one add-on</p>
              <h2 className="text-[26px]! md:text-[30px]! mb-4">
                Need a CPA on the line? <span className="text-gold">{CPA_CONSULTATION.priceLabel}/{CPA_CONSULTATION.unit.replace("per ", "")}</span>.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">
                {CPA_CONSULTATION.description}
              </p>
              <ul className="space-y-2 mb-6">
                {CPA_CONSULTATION.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[14px] text-foreground"
                  >
                    <Check size={15} className="text-gold mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/cpa-consultation" className="btn-gold hover:btn-gold-hover">
                Book a consultation
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="card-base p-7 bg-gold-subtle border-gold-tint">
              <p className="eyebrow mb-3 text-gold!">One hour, one CPA</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-[44px] font-bold text-navy leading-none tabular-nums">
                  {CPA_CONSULTATION.priceLabel}
                </span>
                <span className="text-[14px] text-muted-foreground mb-2">
                  /hour
                </span>
              </div>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                The only paid add-on. No upsells, no retainers, no auto-renew.
                Schedule when you need it.
              </p>
              <div className="mt-5 pt-5 border-t border-border flex items-center gap-3 text-[12.5px] text-muted-foreground">
                <Clock size={13} className="text-gold" />
                Typical wait: 1–3 business days
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
