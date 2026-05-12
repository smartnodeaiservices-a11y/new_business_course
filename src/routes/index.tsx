import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowRight,
  Star,
  Sparkles,
  Target,
  BookOpen,
  Award,
  Shield,
  TrendingUp,
  Quote,
  Check,
  PlayCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { VideoEmbed } from "@/components/VideoEmbed";
import { BuyCourseButton } from "@/components/BuyCourseButton";
import {
  listCourses,
  formatPrice,
  CATEGORY_LABEL,
  type Course,
} from "@/integrations/supabase/courses";
import { FALLBACK_COURSES } from "@/lib/fallback-courses";
import { usePageMeta } from "@/lib/page-meta";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us about your business",
    body: "Six questions on your stage, structure, and top priority. Takes 60 seconds — no email needed.",
    icon: Target,
  },
  {
    step: "02",
    title: "Get a personalized plan",
    body: "We recommend the 1–3 courses that move the needle for where you are — with the total price up front.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Pay once, learn for life",
    body: "Self-paced video lessons, CPA handouts, action items. Lifetime access. 30-day money-back guarantee.",
    icon: BookOpen,
  },
];

const VALUE_PROPS = [
  {
    icon: Award,
    title: "Built by a 20+ year CPA",
    body: "Every module is shaped by real client situations — not theory or recycled blog content.",
  },
  {
    icon: TrendingUp,
    title: "$20K+ average year-1 savings",
    body: "Owners apply one tax-strategy module and recoup the course cost many times over.",
  },
  {
    icon: Shield,
    title: "30-day money-back guarantee",
    body: "Find $2K+ in potential savings — or get every cent refunded. No questions.",
  },
  {
    icon: PlayCircle,
    title: "Self-paced, lifetime access",
    body: "Watch any device, any time. Updated every year as tax law evolves. Yours forever.",
  },
];

const TRUST_METRICS = [
  { value: "2,500+", label: "Owners enrolled" },
  { value: "4.9", label: "Average rating" },
  { value: "$20K+", label: "Avg. year-1 savings" },
  { value: "30 days", label: "Money-back window" },
];

const TESTIMONIALS = [
  {
    quote:
      "Went from paying $14K in self-employment tax to under $5K once I followed the S-Corp module. Course paid for itself 30x in the first quarter.",
    name: "Marcus L.",
    role: "Construction LLC · Year 2",
    location: "Tampa, FL",
    saved: "$9K+ saved Q1",
  },
  {
    quote:
      "Was about to drop $6K on a CPA retainer. This course taught me what I actually needed to ask for — and how to spot when advice was wrong.",
    name: "Priya S.",
    role: "Marketing Consultancy",
    location: "Miami, FL",
    saved: "Avoided $6K/yr retainer",
  },
  {
    quote:
      "The retirement & asset protection units alone changed how I run the business. Five years of compounding savings ahead, not behind.",
    name: "James W.",
    role: "Real Estate LLC · 4 yrs",
    location: "Orlando, FL",
    saved: "$22K projected year 1",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I know which course is right for me?",
    a: "Take the 60-second intake. We ask 6 questions about your business stage, structure, and priorities, then recommend the 1–3 courses that will move the needle — along with the total price.",
  },
  {
    q: "Are these live classes or self-paced?",
    a: "Self-paced video lessons. Watch on any device, any time, as many times as you want. Each module ships with slide decks, downloadable handouts, and step-by-step action items.",
  },
  {
    q: "Do I get the courses forever?",
    a: "Yes. One-time payment, lifetime access. Courses are updated as tax law evolves, and you keep every update.",
  },
  {
    q: "Is there a discount if I want multiple courses?",
    a: "Yes — the Complete Playbook bundles all 7 courses at roughly 44% off vs. buying individually. The intake calculator shows you the comparison automatically.",
  },
  {
    q: "Who is teaching the courses?",
    a: "Each course is built and taught by a 20+ year practicing CPA and former fractional CFO. Every lesson comes directly from real client situations.",
  },
];

export default function HomePage() {
  usePageMeta({
    title: "New Business Course — Tax & finance courses for U.S. business owners",
    description:
      "Self-paced CPA-built courses on entity setup, tax strategy, payroll, asset protection, and exit planning. Pay once. Learn for life.",
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: listCourses,
    staleTime: 5 * 60 * 1000,
  });

  const list = courses && courses.length > 0 ? courses : FALLBACK_COURSES;
  const bundle = list.find((c) => c.category === "bundle");
  const featured = list.filter((c) => c.category !== "bundle" && c.featured).slice(0, 3);

  return (
    <>
      {/* === HERO === */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-linear-to-br from-warm-white via-white to-(--gold-subtle)/30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute -top-32 -right-20 w-[700px] h-[700px] rounded-full bg-(--gold)/15 blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute -bottom-40 -left-20 w-[700px] h-[700px] rounded-full bg-(--navy)/8 blur-[120px]"
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative max-w-[1240px] mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-24 md:pb-32">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-3 mb-6 bg-white border border-border rounded-full pl-2 pr-4 py-1.5 shadow-sm"
              >
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} className="fill-gold text-gold" />
                  ))}
                </span>
                <span className="text-[12.5px] font-semibold text-navy">
                  4.9 · Trusted by 2,500+ U.S. business owners
                </span>
              </motion.div>

              <h1 className="text-[clamp(2.5rem,5vw+0.5rem,4.25rem)]! leading-[1.02]! mb-6">
                Tax & finance courses{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-navy">that pay</span>
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    aria-hidden
                  >
                    <motion.path
                      d="M 2 8 Q 50 2, 100 6 T 198 4"
                      stroke="var(--gold)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
                <br />
                <span className="text-navy">for themselves.</span>
              </h1>

              <p className="text-[18px] md:text-[19px] text-muted-foreground leading-[1.55] mb-9 max-w-xl">
                Self-paced courses for U.S. business owners — entity setup, tax strategy, payroll,
                asset protection, and exit planning. Built by a 20+ year practicing CPA.{" "}
                <strong className="text-navy">Pay once. Learn for life.</strong>
              </p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
                }}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to="/intake"
                    className="btn-gold hover:btn-gold-hover min-h-[54px]! px-7! text-[15px]!"
                  >
                    Find my plan — Free
                    <ArrowRight size={17} />
                  </Link>
                </motion.div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to="/courses"
                    className="btn-outline hover:btn-outline-hover min-h-[54px]! px-7! text-[15px]!"
                  >
                    Browse all courses
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-success" strokeWidth={3} />
                  No subscription
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-success" strokeWidth={3} />
                  Lifetime access
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-success" strokeWidth={3} />
                  30-day refund
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative lg:pl-6"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, rotate: -6, y: 30 }}
                  animate={{ opacity: 1, rotate: -6, y: 30 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute top-0 left-0 w-full pointer-events-none"
                >
                  <div className="card-base p-3 opacity-50 scale-[0.92] origin-top-left">
                    {featured[1] && (
                      <CourseThumbnail
                        category={featured[1].category}
                        title={featured[1].title}
                        size="md"
                      />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 12 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  className="relative card-base p-3 shadow-[0_24px_60px_rgba(11,26,58,0.12)]"
                >
                  {bundle && (
                    <Link to={`/courses/${bundle.slug}`}>
                      <CourseThumbnail
                        category={bundle.category}
                        title={bundle.title}
                        level="Best value"
                        size="lg"
                      />
                    </Link>
                  )}
                  <div className="px-4 py-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold">
                        Featured
                      </span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                        <Star size={11} className="fill-gold text-gold" />
                        4.9 · 1,847 enrolled
                      </span>
                    </div>
                    <h3 className="mb-1">{bundle?.title}</h3>
                    <p className="text-[14px] text-muted-foreground mb-4">
                      {bundle?.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-semibold mb-1">
                          Pay once, learn for life
                        </p>
                        <div className="flex items-baseline gap-2">
                          {bundle?.original_price_cents && (
                            <span className="text-[13px] text-muted-foreground line-through tabular-nums">
                              {formatPrice(bundle.original_price_cents)}
                            </span>
                          )}
                          <span className="text-[26px] font-bold text-navy tabular-nums leading-none">
                            {bundle ? formatPrice(bundle.price_cents) : "$899"}
                          </span>
                        </div>
                      </div>
                      {bundle && (
                        <Link
                          to={`/courses/${bundle.slug}`}
                          className="btn-primary hover:btn-primary-hover min-h-0! py-2.5! px-5! text-[13px]!"
                        >
                          View bundle
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="absolute -top-6 -right-3 sm:-right-6 bg-white border border-border rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(11,26,58,0.10)] z-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-(--success)/10 border border-(--success)/30 flex items-center justify-center shrink-0">
                      <TrendingUp size={18} className="text-success" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        Avg savings
                      </p>
                      <p className="text-[18px] font-bold text-navy tabular-nums leading-none">
                        $20K+{" "}
                        <span className="text-[11px] font-medium text-muted-foreground">
                          /yr
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="absolute -bottom-6 -left-3 sm:-left-6 bg-white border border-border rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(11,26,58,0.10)] z-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-subtle border border-gold-tint flex items-center justify-center shrink-0">
                      <Shield size={18} className="text-gold" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        Guarantee
                      </p>
                      <p className="text-[13.5px] font-bold text-navy leading-tight">
                        30-day refund
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative border-t border-border bg-white/80 backdrop-blur-sm">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-[1200px] mx-auto px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {TRUST_METRICS.map((m) => (
              <motion.div
                key={m.label}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="text-center md:text-left"
              >
                <p className="text-[22px] md:text-[26px] font-bold text-navy tabular-nums leading-none mb-1">
                  {m.value}
                </p>
                <p className="text-[11.5px] text-muted-foreground uppercase tracking-[0.08em] font-semibold">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === Intro video === */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">Watch The Intro</p>
          <h2 className="mb-4">See how it works in 2 minutes.</h2>
          <p className="text-[16px] text-muted-foreground leading-relaxed">
            A short walkthrough of how the courses are structured and what you'll
            walk away with on day one.
          </p>
        </motion.div>
        <motion.div {...fadeUp}>
          <VideoEmbed
            fileId="1Qq-80kexYciCPY3kiTOTaogqKGuxWB69"
            title="New Business Course — Intro"
          />
        </motion.div>
      </section>

      {/* === Value props === */}
      <section className="bg-warm-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow mb-3">Why it works</p>
            <h2 className="mb-4">Built different. Priced different. Worth it.</h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              The course you wish your CPA would sit down and teach you — except they're too busy
              with returns and you're paying $5K/year anyway.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {VALUE_PROPS.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
                    },
                  }}
                  whileHover={{ y: -4 }}
                  className="card-base p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold-tint flex items-center justify-center mb-4">
                    <Icon size={22} className="text-gold" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 text-[18px]!">{p.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* === Featured courses preview === */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Featured Courses</p>
            <h2 className="mb-3">The three owners reach for first.</h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              From foundation to advanced tax strategy. Each one stands alone — or combine them for
              compounding impact.
            </p>
          </div>
          <Link to="/courses" className="btn-outline hover:btn-outline-hover">
            See all courses
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((c) => (
            <motion.div
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
                },
              }}
              whileHover={{ y: -6 }}
              transition={{ y: { duration: 0.25 } }}
            >
              <FeaturedCourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* === How it works === */}
      <section className="bg-warm-white border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow mb-3">How It Works</p>
            <h2 className="mb-4">Three steps. Sixty seconds.</h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              No browsing in the dark. Tell us about your business and we'll point you to exactly
              the courses that will move the needle — with the total price.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid md:grid-cols-3 gap-6 relative"
          >
            {HOW_IT_WORKS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
                    },
                  }}
                  whileHover={{ y: -4 }}
                  className="card-base p-7 relative"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gold-subtle border border-gold-tint flex items-center justify-center">
                      <Icon size={22} className="text-gold" strokeWidth={2} />
                    </div>
                    <span className="text-[44px] font-bold text-surface leading-none tabular-nums">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-[20px]!">{s.title}</h3>
                  <p className="text-[14.5px] text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              to="/intake"
              className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
            >
              Start the 60-second intake
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* === Bundle CTA === */}
      {bundle && (
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-gold opacity-[0.08] blur-3xl translate-x-1/4 -translate-y-1/2" />
          </div>
          <motion.div
            {...fadeUp}
            className="relative max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-24"
          >
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <p className="eyebrow mb-3 text-gold!">Best Value</p>
                <h2 className="text-white mb-4">Pay once. Get every course we ever offer.</h2>
                <p className="text-white/70 text-[16.5px] leading-relaxed mb-7 max-w-xl">
                  The Complete Playbook bundles all 7 courses at a 44% discount. Plus every future
                  course we add — free, forever. Most owners save more than the bundle price with a
                  single strategy in any one course.
                </p>
                <div className="flex flex-wrap items-baseline gap-3 mb-7">
                  {bundle.original_price_cents && (
                    <span className="text-[22px] text-white/40 line-through tabular-nums">
                      {formatPrice(bundle.original_price_cents)}
                    </span>
                  )}
                  <span className="text-[48px] font-bold text-gold tabular-nums leading-none">
                    {formatPrice(bundle.price_cents)}
                  </span>
                  <span className="text-[13px] text-white/60">one-time · lifetime</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  <BuyCourseButton
                    course={bundle}
                    source="home-bundle-cta"
                    className="btn-gold hover:btn-gold-hover"
                  >
                    Buy the bundle
                    <ArrowRight size={16} />
                  </BuyCourseButton>
                  <Link
                    to={`/courses/${bundle.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] border border-white/20 text-white text-[14px] font-semibold hover:bg-white/5 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 space-y-3">
                  {[
                    "All 7 courses (Foundations → Exit)",
                    "29 modules · 30+ hours of content",
                    "Lifetime updates as tax law changes",
                    "Priority email support",
                    "All future courses included free",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-(--gold)/15 border border-(--gold)/40 flex items-center justify-center mt-0.5 shrink-0">
                        <Check size={11} className="text-gold" strokeWidth={3} />
                      </div>
                      <p className="text-[14px] text-white/85 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* === Testimonials === */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <motion.div {...fadeUp} className="max-w-2xl mb-12">
          <p className="eyebrow mb-3">Owner Stories</p>
          <h2 className="mb-3">From U.S. owners who stopped overpaying.</h2>
          <p className="text-[16px] text-muted-foreground leading-relaxed">
            Three short stories from owners who applied one or two modules — and watched the math
            change immediately.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
                },
              }}
              whileHover={{ y: -4 }}
              className="card-base p-8 flex flex-col"
            >
              <Quote size={28} className="text-(--gold)/40 mb-3" />
              <blockquote className="text-[15px] text-foreground leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="pt-5 border-t border-border">
                <p className="text-[14px] font-semibold text-navy">{t.name}</p>
                <p className="text-[12px] text-muted-foreground">{t.role}</p>
                <p className="text-[12px] text-muted-foreground">{t.location}</p>
                <p className="mt-3 inline-block text-[11px] font-bold tracking-[0.08em] uppercase bg-gold-subtle border border-gold-tint text-navy px-2.5 py-1 rounded">
                  {t.saved}
                </p>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      {/* === Instructor === */}
      <section className="bg-navy text-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-20 md:py-24 grid md:grid-cols-[260px_1fr] gap-10 items-center">
          <motion.div {...fadeUp} className="mx-auto md:mx-0">
            <div className="w-[220px] h-[220px] rounded-full bg-(--gold)/15 border-2 border-(--gold)/40 flex items-center justify-center text-gold text-[68px] font-bold">
              CPA
            </div>
          </motion.div>
          <motion.div {...fadeUp}>
            <p className="eyebrow mb-3 text-gold!">Meet Your Instructor</p>
            <h2 className="text-white mb-5">20+ years in the trenches with business owners.</h2>
            <p className="text-white/70 text-[15.5px] mb-4 leading-relaxed max-w-xl">
              Built from two decades as a practicing CPA and 15+ years as a fractional CFO — working
              with everyone from one-person LLCs to $10M+ operating businesses. Every module came
              directly from a real client situation: a mistake to avoid, a strategy to capture, a
              decision to get right.
            </p>
            <p className="text-white/55 text-[14px] leading-relaxed max-w-xl mb-7">
              This isn't recycled blog content. It's the same playbook used to help thousands of
              owners keep more of what they earn.
            </p>
            <div className="flex flex-wrap gap-3">
              {["20+ yrs CPA", "15+ yrs CFO", "Thousands of owners served", "Florida-licensed"].map(
                (b) => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold tracking-widest uppercase bg-white/5 border border-white/15 text-white/70 px-3 py-1.5 rounded"
                  >
                    {b}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="max-w-[860px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-3">Common Questions</p>
          <h2 className="mb-4">Everything owners ask before enrolling.</h2>
        </motion.div>

        <motion.div {...fadeUp}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <AccordionItem
                key={i}
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
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* === Final CTA === */}
      <section className="bg-warm-white border-t border-border">
        <motion.div {...fadeUp} className="max-w-[900px] mx-auto px-6 py-20 md:py-24 text-center">
          <p className="eyebrow mb-3">Get Started</p>
          <h2 className="mb-5">Ready to keep more of what you earn?</h2>
          <p className="text-[16.5px] text-muted-foreground max-w-xl mx-auto mb-9 leading-relaxed">
            Take the 60-second intake and we'll recommend the right courses for your business — with
            the exact price up front.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/intake"
              className="btn-gold hover:btn-gold-hover min-h-[54px]! px-8! text-[15px]!"
            >
              Find my plan
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/courses"
              className="btn-outline hover:btn-outline-hover min-h-[54px]! px-8! text-[15px]!"
            >
              Browse all courses
            </Link>
          </div>
          <p className="text-[12.5px] text-muted-foreground mt-6">
            30-day money-back guarantee · One-time payment · Lifetime access
          </p>
        </motion.div>
      </section>
    </>
  );
}

function FeaturedCourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="card-base hover:card-hover p-2.5 block group h-full"
    >
      <CourseThumbnail
        category={course.category}
        title={course.title}
        level={course.level === "all" ? "All levels" : course.level}
        size="md"
      />
      <div className="px-3 py-4">
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gold mb-2 block">
          {CATEGORY_LABEL[course.category]}
        </span>
        <h3 className="mb-1.5 group-hover:text-gold transition-colors">{course.title}</h3>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 min-h-[42px]">
          {course.subtitle}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
          <span className="text-[20px] font-bold text-navy tabular-nums leading-none">
            {formatPrice(course.price_cents)}
          </span>
          <BuyCourseButton
            course={course}
            source="home-featured-card"
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-gold text-navy hover:bg-gold/90 inline-flex items-center gap-1 transition-colors"
          >
            Buy
            <ArrowRight size={12} />
          </BuyCourseButton>
        </div>
      </div>
    </Link>
  );
}
