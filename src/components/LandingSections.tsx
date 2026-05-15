import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Award, Check, Clock, Download, FileText, PlayCircle, Quote, Shield, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { COURSE_MODULES } from "@/lib/curriculum";
import { findHandoutBySlug } from "@/lib/module-handouts";
import { downloadHandoutPdf } from "@/lib/generate-handout-pdf";
import {
  FOUNDATIONS_CURRICULUM,
  FOUNDATIONS_FAQ,
  FOUNDATIONS_OUTCOMES,
  FOUNDATIONS_TESTIMONIALS,
  INSTRUCTOR,
} from "@/lib/landing-content";

// Shared entrance config — visible lift, out-expo curve, plays once per scroll.
// Mirrors src/lib/animations.ts (kept inline here so existing usages with the
// {...fadeUp} spread keep working without touching every callsite).
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: EASE },
};

// Stagger pattern for grids/lists. Use as:
//   <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={...}>
//     <motion.div variants={staggerChild}>...</motion.div>
//   </motion.div>
const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const viewportOnce = { once: true, amount: 0.15 };

// As-seen-on social proof bar — sourced from atomicfunnels.com's "whiteslider".
// Two image rows scroll in opposite directions. Each LP gets a stable shuffle
// via the seed prop so variants feel distinct without churn.
import {
  PRESS_LOGOS_ROW_A,
  PRESS_LOGOS_ROW_B,
  shuffleSeeded,
  type PressLogo,
} from "@/components/PressLogos";

function MarqueeLogosRow({
  items,
  direction = "left",
  durationSec = 40,
}: {
  items: PressLogo[];
  direction?: "left" | "right";
  durationSec?: number;
}) {
  // Duplicate items once so the -50% translate produces a seamless loop.
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div
        className={`marquee__track${direction === "right" ? " marquee__track--right" : ""}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {doubled.map(({ name, src }, i) => (
          <img
            key={`${name}-${i}`}
            src={src}
            alt={i < items.length ? `Featured publication ${i + 1}` : ""}
            aria-hidden={i >= items.length}
            loading="lazy"
            decoding="async"
            className="h-[60px] md:h-[72px] w-auto object-contain shrink-0 opacity-90 hover:opacity-100 transition-opacity"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

export function AsSeenOnSection({
  /** Tone now controls the dark band style. White logos read poorly on light
   *  backgrounds — default to the navy band; "deep" inverts to near-black. */
  tone = "navy",
  /** Stable seed used to shuffle each row's logos. Different seeds per LP
   *  give each variant a different-looking press bar. */
  seed = 1,
}: {
  tone?: "navy" | "deep";
  seed?: number;
}) {
  const rowA = shuffleSeeded(PRESS_LOGOS_ROW_A, seed);
  const rowB = shuffleSeeded(PRESS_LOGOS_ROW_B, seed * 7 + 3);

  return (
    <section className={tone === "deep" ? "bg-black" : "bg-navy"}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <motion.p
          {...fadeUp}
          className="text-center text-[11.5px] font-bold uppercase tracking-[0.18em] text-white/55 mb-7"
        >
          As Seen On
        </motion.p>
        <div className="space-y-6">
          <MarqueeLogosRow items={rowA} direction="left" durationSec={45} />
          <MarqueeLogosRow items={rowB} direction="right" durationSec={55} />
        </div>
      </div>
    </section>
  );
}

// Real-client case studies (Averkamp CPA Group). Numbers are illustrative —
// the source documents include the standard "individual results vary" note.
type CaseStudy = {
  tag: string;
  headline: string;
  client: string;
  snapshot: { label: string; value: string }[];
  problem: string;
  result: { label: string; value: string };
  quote: string;
  attribution: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    tag: "Missed Deductions",
    headline: "Recovered $58,700 in year one by catching missed deductions.",
    client: "Service business · S-Corp · $850K revenue",
    snapshot: [
      { label: "Net income", value: "$220K" },
      { label: "Prior CPA tenure", value: "7 years" },
      { label: "New deductions captured", value: "~$43K/yr" },
    ],
    problem:
      "A long-standing CPA filed accurate returns every year — but accurate is not optimized. We reviewed three prior returns and surfaced six categories of deductions the owner had clear, legitimate access to but had either claimed at the simplest level or skipped entirely.",
    result: { label: "First-year benefit", value: "~$58,700" },
    quote:
      "I'd been paying my old CPA for years to file taxes correctly. Matt showed me he had been filing correctly — just not strategically. We recovered $24K from amended returns and saved another $14K a year going forward.",
    attribution: "Service Business Owner",
  },
  {
    tag: "S-Corp Election",
    headline: "Cut a $275K business's tax bill by $10,500 with an S-Corp election.",
    client: "Solo service business · Single-member LLC",
    snapshot: [
      { label: "Net income", value: "$165K" },
      { label: "Prior SE tax", value: "~$23,300/yr" },
      { label: "Reasonable comp set at", value: "$75,000" },
    ],
    problem:
      "The owner had built a high-margin service business but was being taxed like a freelancer. Every dollar of profit ran through Schedule C — $165K hit with 15.3% self-employment tax. Her previous CPA filed accurate returns but never raised entity election.",
    result: { label: "Net first-year savings", value: "~$10,500" },
    quote:
      "Matt found over $10,000 a year of savings my last CPA had been missing for years. The whole switch took one afternoon and a couple of e-signatures.",
    attribution: "Service Business Owner",
  },
  {
    tag: "Solo 401(k)",
    headline: "$76K/yr tax-deferred — built a $3M retirement runway.",
    client: "Professional services · S-Corp · age 52",
    snapshot: [
      { label: "Net income", value: "$500K" },
      { label: "Prior IRA contribution", value: "$7K/yr" },
      { label: "New deferral", value: "$76K/yr" },
    ],
    problem:
      "The owner had elected S-corp status two years earlier but was still funding retirement the way she had as a freelancer — $7K a year into a Traditional IRA. As an S-corp owner she had access to plans sheltering ten times what an IRA allows.",
    result: { label: "20-year projection at 7%", value: "$3.1M+" },
    quote:
      "In two hours of planning, Matt found me $26,000 of tax savings every year going forward — and built a $3 million retirement runway my old CPA never mentioned in seven years of filings.",
    attribution: "Professional Services Owner",
  },
];

export function CaseStudiesSection({ tone = "light" }: { tone?: "light" | "warm" }) {
  return (
    <section className={tone === "warm" ? "bg-warm-white border-y border-border" : "bg-white"}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">Case studies</p>
          <h2 className="text-[28px]! md:text-[32px]! mb-3">
            Real engagements. Real numbers.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Three Averkamp CPA Group cases — what the prior CPA missed, what we changed,
            and what the owner kept. Illustrative numbers from real engagements;
            individual results vary.
          </p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid lg:grid-cols-3 gap-5"
        >
          {CASE_STUDIES.map((cs) => (
            <motion.article
              key={cs.tag}
              variants={staggerChild}
              className="card-base p-6 bg-white flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold bg-gold-subtle border border-gold-tint px-2.5 py-1 rounded">
                  {cs.tag}
                </span>
              </div>
              <h3 className="text-[19px]! mb-2 leading-snug">{cs.headline}</h3>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-4">
                {cs.client}
              </p>

              <dl className="grid grid-cols-3 gap-2 mb-5">
                {cs.snapshot.map((s) => (
                  <div key={s.label} className="bg-warm-white rounded-lg px-2.5 py-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="text-[13.5px] font-bold text-navy tabular-nums leading-tight">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="text-[14px] text-foreground leading-relaxed mb-5">
                {cs.problem}
              </p>

              <div className="rounded-lg bg-navy text-white px-4 py-3 mb-5 flex items-center gap-3">
                <TrendingUp size={18} className="text-gold shrink-0" />
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/60">
                    {cs.result.label}
                  </p>
                  <p className="text-[18px] font-bold tabular-nums leading-tight text-white">
                    {cs.result.value}
                  </p>
                </div>
              </div>

              <figure className="mt-auto pt-4 border-t border-border">
                <Quote size={18} className="text-(--gold)/40 mb-2" />
                <blockquote className="text-[13.5px] text-foreground leading-relaxed italic mb-2">
                  "{cs.quote}"
                </blockquote>
                <figcaption className="text-[12px] font-semibold text-muted-foreground">
                  — {cs.attribution}
                </figcaption>
              </figure>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          {...fadeUp}
          className="mt-8 max-w-3xl text-[11.5px] text-muted-foreground leading-relaxed"
        >
          Note: Numbers shown are illustrative of real engagements. Individual results vary
          based on income, entity, substantiation of expenses, applicable state law, and
          other facts and circumstances. Several deductions referenced (Augusta Rule, home
          office actual method, S-corp health insurance) have specific documentation
          requirements — this is not tax advice for your specific situation.
        </motion.p>
      </div>
    </section>
  );
}

// Renders every course module with its free PDF handout download — used on
// every landing-page variant so prospects can sample the material without
// enrolling. Single component → consistent across all LPs.
export function ModulesAndHandoutsSection({
  tone = "light",
  title = "All 15 modules — with free handouts.",
  eyebrow = "Course modules + handouts",
  body = "Every module ships with a downloadable PDF handout. They're free — preview the curriculum and grab any handout before you enroll.",
}: {
  tone?: "light" | "warm";
  title?: string;
  eyebrow?: string;
  body?: string;
}) {
  return (
    <section className={tone === "warm" ? "bg-warm-white border-y border-border" : "bg-white"}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-[28px]! md:text-[32px]! mb-3">{title}</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">{body}</p>
        </motion.div>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {COURSE_MODULES.map((m) => {
            const handout = findHandoutBySlug(m.slug);
            return (
              <motion.li
                key={m.slug}
                variants={staggerChild}
                className="card-base p-5 bg-white flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-[22px] font-bold text-gold tabular-nums leading-none w-8 shrink-0">
                    {String(m.number).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="m-0! mb-1 text-[15.5px]!">{m.title}</h4>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
                      {m.summary}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-border flex items-center gap-2">
                  <Link
                    to={`/modules/${m.slug}`}
                    className="text-[12px] font-semibold text-navy hover:text-gold inline-flex items-center gap-1 transition-colors"
                  >
                    <PlayCircle size={13} />
                    Preview
                  </Link>
                  <span className="text-border">·</span>
                  {handout ? (
                    <button
                      type="button"
                      onClick={() => {
                        void downloadHandoutPdf(handout);
                      }}
                      className="text-[12px] font-semibold text-gold hover:text-navy inline-flex items-center gap-1 transition-colors"
                    >
                      <Download size={13} />
                      Free PDF
                    </button>
                  ) : (
                    <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1">
                      <FileText size={13} />
                      Handout
                    </span>
                  )}
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

export function CurriculumSection({ tone = "light" }: { tone?: "light" | "warm" }) {
  return (
    <section className={tone === "warm" ? "bg-warm-white border-y border-border" : "bg-white"}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">The curriculum</p>
          <h2 className="text-[28px]! md:text-[32px]! mb-3">
            4 modules · ~4 hours · everything you need.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Each module is a self-contained playbook: a CPA-recorded video lesson, a
            downloadable handout, and a step-by-step action item you can implement the
            same day.
          </p>
        </motion.div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-3"
        >
          {FOUNDATIONS_CURRICULUM.map((m) => (
            <motion.div
              key={m.n}
              variants={staggerChild}
              className="card-base px-6 py-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center bg-white"
            >
              <span className="text-[26px] font-bold text-gold tabular-nums leading-none">
                {m.n}
              </span>
              <div>
                <h4 className="mb-1">{m.title}</h4>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                  {m.body}
                </p>
              </div>
              <span className="text-[12px] text-muted-foreground inline-flex items-center gap-1 whitespace-nowrap">
                <Clock size={12} />
                {m.duration}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function OutcomesSection({ tone = "light" }: { tone?: "light" | "warm" }) {
  return (
    <section className={tone === "warm" ? "bg-warm-white border-y border-border" : "bg-white"}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <p className="eyebrow mb-3">What you'll walk away with</p>
            <h2 className="text-[28px]! mb-4">Six outcomes you can apply this week.</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Every outcome maps to a specific module and ships with a step-by-step
              action item — no theory, no fluff.
            </p>
          </div>
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid sm:grid-cols-2 gap-x-6 gap-y-4"
          >
            {FOUNDATIONS_OUTCOMES.map((o) => (
              <motion.li
                key={o}
                variants={staggerChild}
                className="flex items-start gap-3 text-[14.5px] text-foreground leading-relaxed"
              >
                <div className="w-6 h-6 rounded-full bg-(--gold)/15 border border-(--gold)/40 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={13} className="text-gold" strokeWidth={3} />
                </div>
                {o}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

export function InstructorSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">Who's teaching</p>
            <h2 className="text-[26px]! mb-3">{INSTRUCTOR.name.split(" — ")[0]}</h2>
            <p className="text-[13px] font-semibold text-gold uppercase tracking-widest mb-5">
              {INSTRUCTOR.credentials}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {INSTRUCTOR.highlights.map((h) => (
                <div
                  key={h}
                  className="card-base p-3 text-[13px] text-foreground flex items-start gap-2"
                >
                  <Award size={14} className="text-gold mt-0.5 shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[15.5px] text-foreground leading-relaxed">
              {INSTRUCTOR.bio}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ tone = "warm" }: { tone?: "light" | "warm" }) {
  return (
    <section className={tone === "warm" ? "bg-warm-white border-y border-border" : "bg-white"}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Owners saying it themselves</p>
          <h2 className="text-[28px]! mb-3">2,500+ owners enrolled. 4.9-star rated.</h2>
        </motion.div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-4"
        >
          {FOUNDATIONS_TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerChild}
              className="card-base p-6 bg-white"
            >
              <Quote size={22} className="text-(--gold)/40 mb-3" />
              <p className="text-[14.5px] text-foreground leading-relaxed mb-5">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-[14px] font-semibold text-navy">{t.name}</p>
                <p className="text-[12.5px] text-muted-foreground mb-2">{t.role}</p>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-gold bg-gold-subtle border border-gold-tint px-2 py-0.5 rounded">
                  <Star size={10} className="fill-current" />
                  {t.saved}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[860px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Common questions</p>
          <h2 className="text-[28px]! mb-3">Answered before you ask.</h2>
        </motion.div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FOUNDATIONS_FAQ.map((f, i) => (
              <motion.div key={i} variants={staggerChild}>
                <AccordionItem
                  value={`faq-${i}`}
                  className="border-b-0! card-base data-[state=open]:border-(--gold)/50 overflow-hidden"
                >
                  <AccordionTrigger className="py-5! px-6! text-[16px]! text-navy! font-semibold! hover:no-underline!">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6! pb-5! pt-0!">
                    <p className="text-[14.5px] text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export function GuaranteeSection() {
  return (
    <section className="bg-warm-white border-y border-border">
      <div className="max-w-[860px] mx-auto px-6 md:px-10 py-14 text-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex w-14 h-14 rounded-full bg-(--gold)/15 border border-(--gold)/40 items-center justify-center mb-5">
            <Shield size={26} className="text-gold" strokeWidth={2} />
          </div>
          <h2 className="text-[24px]! mb-3">30-day money-back guarantee.</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Find at least $2,000 in potential tax savings or process improvements after
            going through the course — or email us and we'll refund every cent. No
            forms, no friction.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCtaSection({
  variant,
  courseSlug,
  price,
  headline = "Ready when you are.",
  body = "One-time payment. Lifetime access. Updated every year as tax law changes.",
}: {
  variant: string;
  courseSlug: string;
  price: string;
  headline?: string;
  body?: string;
}) {
  return (
    <section className="bg-navy text-white">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 py-20 text-center">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3 text-gold!">Get started</p>
          <h2 className="text-white text-[30px]! md:text-[36px]! mb-5">{headline}</h2>
          <p className="text-white/70 text-[15.5px] max-w-xl mx-auto mb-8 leading-relaxed">
            {body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`/enroll?course=${courseSlug}&utm_source=${variant}&variant=${variant}`}
              className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
            >
              Enroll · {price} one-time
              <ArrowRight size={17} />
            </a>
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] border border-white/20 text-white text-[14px] font-semibold hover:bg-white/5 transition-colors"
            >
              Back to top
            </a>
          </div>
          <p className="text-[12px] text-white/55 mt-6">
            30-day money-back guarantee · Stripe & PayPal accepted
          </p>
        </motion.div>
      </div>
    </section>
  );
}
