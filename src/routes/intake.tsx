import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Clock,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  listCourses,
  recommendCourses,
  formatPrice,
  CATEGORY_LABEL,
  LEVEL_LABEL,
  type Course,
  type IntakeProfile,
} from "@/integrations/supabase/courses";
import { CourseThumbnail } from "@/components/CourseThumbnail";
import { LeadCaptureStep } from "@/components/LeadCaptureStep";
import { readLead, writeLead, persistLeadToSupabase, type Lead } from "@/lib/lead";
import { redirectToStripeCheckout, isStripeConfigured } from "@/lib/stripe";
import { FALLBACK_COURSES } from "@/lib/fallback-courses";
import { usePageMeta } from "@/lib/page-meta";

type Step = "lead" | "questions" | "plan" | "direct";

type Answers = {
  stage: IntakeProfile["stage"] | null;
  entity: string | null;
  revenue: string | null;
  priority: IntakeProfile["priority"] | null;
  team: string | null;
  finance: string | null;
};

type Question = {
  id: keyof Answers;
  prompt: string;
  hint?: string;
  options: { value: string; label: string; sub?: string }[];
};

const INITIAL_ANSWERS: Answers = {
  stage: null,
  entity: null,
  revenue: null,
  priority: null,
  team: null,
  finance: null,
};

const QUESTIONS: Question[] = [
  {
    id: "stage",
    prompt: "Where are you in your business journey?",
    hint: "Pick the closest match — we'll fine-tune based on your other answers.",
    options: [
      { value: "pre-llc", label: "Pre-LLC", sub: "Planning to start, not registered yet" },
      { value: "new-owner", label: "Year One", sub: "Operating less than 12 months" },
      { value: "growing", label: "Growing", sub: "1–3 years, revenue ramping" },
      { value: "scaling", label: "Established", sub: "3+ years, scaling or established" },
    ],
  },
  {
    id: "entity",
    prompt: "What's your current business entity?",
    options: [
      { value: "none", label: "None yet", sub: "Haven't registered" },
      { value: "sole-prop", label: "Sole proprietor / DBA" },
      { value: "llc", label: "LLC (default tax treatment)" },
      { value: "scorp", label: "S-Corp (or LLC w/ S-Corp election)" },
      { value: "ccorp", label: "C-Corp" },
      { value: "other", label: "Other / not sure" },
    ],
  },
  {
    id: "revenue",
    prompt: "What's your approximate annual revenue?",
    hint: "Last 12 months — or projected if you're new.",
    options: [
      { value: "under-50k", label: "Under $50K" },
      { value: "50-150k", label: "$50K – $150K" },
      { value: "150-500k", label: "$150K – $500K" },
      { value: "500k-1m", label: "$500K – $1M" },
      { value: "1m-plus", label: "$1M+" },
    ],
  },
  {
    id: "priority",
    prompt: "What's your single biggest priority right now?",
    hint: "Pick the one that would move the needle most.",
    options: [
      {
        value: "foundations",
        label: "Getting the foundation right",
        sub: "Entity, books, infrastructure",
      },
      { value: "tax", label: "Lowering my tax bill", sub: "Strategy, deductions, planning" },
      { value: "operations", label: "Payroll & contractor setup", sub: "Hiring the right way" },
      {
        value: "protection",
        label: "Protecting what I've built",
        sub: "Asset protection, liability",
      },
      { value: "exit", label: "Planning an exit or succession", sub: "Sale, transfer, valuation" },
    ],
  },
  {
    id: "team",
    prompt: "What does your team look like today?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "contractors", label: "Me + contractors" },
      { value: "small-team", label: "Small team (1–10 employees)" },
      { value: "larger", label: "10+ employees" },
    ],
  },
  {
    id: "finance",
    prompt: "How are you handling finances right now?",
    options: [
      { value: "diy", label: "DIY — spreadsheets" },
      { value: "software", label: "Accounting software (QuickBooks, Xero, etc.)" },
      { value: "bookkeeper", label: "A bookkeeper" },
      { value: "cpa-yearend", label: "A CPA at year-end only" },
      { value: "cpa-yearround", label: "Year-round CPA + advisor" },
    ],
  },
];

export default function IntakePage() {
  usePageMeta({
    title: "Find my plan — Business intake",
    description:
      "Six questions about your business. Get a personalized course recommendation and price in 60 seconds.",
  });

  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get("course"); // Direct enroll route
  const navigate = useNavigate();

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: listCourses,
    staleTime: 5 * 60 * 1000,
  });

  // Always have something to recommend from — never block the user on data loading.
  const courseList = courses && courses.length > 0 ? courses : FALLBACK_COURSES;

  const [lead, setLead] = useState<Lead | null>(() => readLead());
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [questionIdx, setQuestionIdx] = useState(0);

  // Direct course route (?course=slug) skips the questions and goes straight
  // to lead capture, then the order summary for that single course.
  const directCourse = useMemo(() => {
    if (!courseSlug) return null;
    return courseList.find((c) => c.slug === courseSlug) ?? null;
  }, [courseSlug, courseList]);

  // Step machine — flow varies by entry point:
  //   /intake             → "questions" → "lead" → "plan"
  //   /enroll?course=X    → "direct" (single-screen email + pay → Stripe)
  const [step, setStep] = useState<Step>(() => {
    if (directCourse || courseSlug) return "direct";
    return "questions";
  });

  function handleLeadSubmit(l: Lead) {
    setLead(l);
    writeLead(l);
    setStep("plan");
  }

  function answerQuestion(value: string) {
    const q = QUESTIONS[questionIdx];
    setAnswers({ ...answers, [q.id]: value });
  }

  function nextQuestion() {
    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
      return;
    }
    // After the last question: skip lead capture if we already have one.
    setStep(lead ? "plan" : "lead");
  }

  function prevQuestion() {
    if (questionIdx > 0) setQuestionIdx(questionIdx - 1);
  }

  return (
    <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-14 md:py-20">
      <AnimatePresence mode="wait">
        {step === "direct" && directCourse && (
          <motion.div
            key="direct"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DirectEnrollView
              course={directCourse}
              initialLead={lead}
              source={searchParams.get("variant") ?? searchParams.get("utm_source") ?? "enroll"}
              onLeadSaved={(l) => {
                setLead(l);
                writeLead(l);
              }}
            />
          </motion.div>
        )}

        {step === "direct" && !directCourse && (
          <div className="max-w-[640px] mx-auto text-center py-12">
            <h1 className="mb-3">We couldn't find that course.</h1>
            <p className="text-[15px] text-muted-foreground mb-6">
              The course <code>{courseSlug}</code> doesn't exist. Browse the catalog or take the
              60-second intake for a personalized plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/courses" className="btn-gold hover:btn-gold-hover">
                Browse all courses
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setStep("questions")}
                className="btn-outline hover:btn-outline-hover"
              >
                Take the intake
              </button>
            </div>
          </div>
        )}

        {step === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionsView
              question={QUESTIONS[questionIdx]}
              questionIdx={questionIdx}
              totalQuestions={QUESTIONS.length}
              selected={answers[QUESTIONS[questionIdx].id]}
              onSelect={answerQuestion}
              onNext={nextQuestion}
              onBack={prevQuestion}
            />
          </motion.div>
        )}

        {step === "lead" && (
          <motion.div
            key="lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <LeadCaptureStep
              title={
                directCourse
                  ? `Enroll in ${directCourse.title}`
                  : "Almost there — where should we send your plan?"
              }
              subtitle={
                directCourse
                  ? "Three quick details and we'll show you the order summary."
                  : "Your personalized plan is ready. Add three quick details so we can deliver your courses and any future tax-strategy updates."
              }
              ctaLabel={directCourse ? "Continue to order summary" : "See my plan"}
              initialLead={lead}
              onSubmit={handleLeadSubmit}
            />
          </motion.div>
        )}

        {step === "plan" && lead && (
          <motion.div
            key="plan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <PlanView
              lead={lead}
              answers={answers}
              courseList={courseList}
              directCourse={directCourse}
              onRetake={() => {
                setAnswers(INITIAL_ANSWERS);
                setQuestionIdx(0);
                setStep("questions");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ===== Questions Step =====

function QuestionsView({
  question,
  questionIdx,
  totalQuestions,
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  question: Question;
  questionIdx: number;
  totalQuestions: number;
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-[720px] mx-auto">
      <header className="mb-10">
        <p className="text-[13px] font-semibold text-gold uppercase tracking-[0.12em] mb-3">
          Question {questionIdx + 1} of {totalQuestions}
        </p>
        <h1 className="mb-2">Tell us about your business.</h1>
        <p className="text-[16px] text-muted-foreground leading-relaxed">
          Your answers shape the recommendation. Pick the closest match — no perfect answer.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold text-muted-foreground">
            {Math.round(((questionIdx + 1) / totalQuestions) * 100)}% complete
          </p>
          <p className="text-[12px] text-muted-foreground">
            ~{Math.max(1, totalQuestions - questionIdx)} min left
          </p>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-gold to-[#d9a030]"
            initial={false}
            animate={{ width: `${((questionIdx + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {/* Big visible question */}
          <div className="mb-7">
            <h2 className="text-[28px]! sm:text-[34px]! leading-[1.15]! mb-3">{question.prompt}</h2>
            {question.hint && (
              <p className="text-[15px] text-muted-foreground leading-relaxed">{question.hint}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const sel = selected === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => onSelect(opt.value)}
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className={`w-full text-left rounded-2xl px-5 py-4 border-2 transition-colors flex items-center gap-4 ${
                    sel
                      ? "border-navy bg-gold-subtle shadow-[0_4px_20px_rgba(11,26,58,0.08)]"
                      : "border-border bg-white hover:border-gold hover:bg-gold-subtle/40"
                  }`}
                >
                  <motion.div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold ${
                      sel ? "bg-navy text-white" : "bg-surface text-muted-foreground"
                    }`}
                    animate={{ scale: sel ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sel ? <Check size={16} /> : String.fromCharCode(65 + i)}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-[16px] font-semibold text-navy leading-tight">{opt.label}</p>
                    {opt.sub && (
                      <p className="text-[13.5px] text-muted-foreground mt-1 leading-relaxed">
                        {opt.sub}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted-foreground hover:text-navy transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <motion.button
          onClick={onNext}
          disabled={!selected}
          whileHover={{ scale: selected ? 1.02 : 1 }}
          whileTap={{ scale: selected ? 0.98 : 1 }}
          className="btn-gold hover:btn-gold-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {questionIdx === totalQuestions - 1 ? "See my plan" : "Continue"}
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

// ===== Plan Step =====

function PlanView({
  lead,
  answers,
  courseList,
  directCourse,
  onRetake,
}: {
  lead: Lead;
  answers: Answers;
  courseList: Course[];
  directCourse: Course | null;
  onRetake: () => void;
}) {
  const recommendation = useMemo(() => {
    if (directCourse) {
      // Direct enroll: single course pre-selected. Still surface the bundle as an upsell.
      const bundle = courseList.find((c) => c.category === "bundle");
      const bundleSavings =
        bundle && bundle.original_price_cents
          ? Math.max(0, bundle.original_price_cents - bundle.price_cents)
          : 0;
      return {
        courses: [directCourse],
        bundleCourse: bundle,
        // Show bundle upsell on direct-enroll unless the user already picked the bundle.
        showBundle: !!bundle && directCourse.category !== "bundle",
        subtotalCents: directCourse.price_cents,
        bundleSavingsCents: bundleSavings,
        reasoning: `Ready to enroll in ${directCourse.title}. Review your order summary below.`,
      };
    }
    // Build profile from answers
    const stage = (answers.stage ?? "new-owner") as IntakeProfile["stage"];
    const priority = (answers.priority ?? "foundations") as IntakeProfile["priority"];
    return recommendCourses(
      {
        stage,
        priority,
        entity: answers.entity ?? undefined,
        revenueBand: answers.revenue ?? undefined,
      },
      courseList,
    );
  }, [answers, courseList, directCourse]);

  // Default to the bundle when available — pay once, get every course.
  const [choice, setChoice] = useState<"individual" | "bundle">(
    recommendation.showBundle && recommendation.bundleCourse ? "bundle" : "individual",
  );
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCourses = useMemo(() => {
    if (choice === "bundle" && recommendation.bundleCourse) {
      return [recommendation.bundleCourse];
    }
    return recommendation.courses;
  }, [choice, recommendation]);

  const totalCents = selectedCourses.reduce((s: number, c: Course) => s + c.price_cents, 0);
  const bundleCourse: Course | undefined = recommendation.bundleCourse;
  const allIndividualCourses: Course[] = courseList.filter((c) => c.category !== "bundle");

  async function handlePay() {
    setError(null);
    setPaying(true);
    try {
      // Save lead first — even if Stripe fails, we capture the lead.
      await persistLeadToSupabase(lead, {
        segment: answers.stage ?? undefined,
        pain: answers.priority ?? undefined,
        source: directCourse ? `enroll:${directCourse.slug}` : "intake",
      });

      if (!isStripeConfigured()) {
        setError(
          "Payment isn't configured yet. Set VITE_STRIPE_PUBLISHABLE_KEY in .env and deploy the create-checkout-session Edge Function.",
        );
        setPaying(false);
        return;
      }

      await redirectToStripeCheckout({
        lineItems: selectedCourses.map((c) => ({
          name: c.title,
          description: c.subtitle,
          amountCents: c.price_cents,
          priceId: c.stripe_price_id ?? undefined,
        })),
        customerEmail: lead.email,
        successPath: "/success",
        cancelPath: "/cancel",
        metadata: {
          course_slugs: selectedCourses.map((c) => c.slug).join(","),
          source: directCourse ? `enroll:${directCourse.slug}` : "intake",
        },
      });
    } catch (err) {
      console.error("[pay]", err);
      setError(err instanceof Error ? err.message : "Payment couldn't start. Please try again.");
      setPaying(false);
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <header className="text-center mb-10">
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="chip mb-5 mx-auto"
        >
          <Sparkles size={14} />
          Your Personalized Plan
        </motion.span>
        <h1 className="mb-3">
          {directCourse ? "Review your order." : `Here's your plan, ${lead.name.split(" ")[0]}.`}
        </h1>
        <p className="text-[16.5px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {recommendation.reasoning}
        </p>
      </header>

      {/* PRIMARY OFFER: Bundle hero card — lead with the all-access package */}
      {recommendation.showBundle && bundleCourse && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative mb-6 overflow-hidden rounded-3xl bg-navy text-white p-6 md:p-8 border-2 border-gold"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold opacity-[0.08] blur-3xl translate-x-1/3 -translate-y-1/3" />
          </div>
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-navy bg-gold px-3 py-1 rounded-full mb-4">
                <Sparkles size={12} />
                Best Value · Pay Once
              </span>
              <h2 className="text-white! mb-3">Get every course for one payment.</h2>
              <p className="text-white/75 text-[15.5px] leading-relaxed mb-5">
                Skip the picking.{" "}
                <strong className="text-gold">All {allIndividualCourses.length} courses</strong>,
                every module, every future update — for one price. Most owners save this back with a
                single tax strategy in any one course.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  `All ${allIndividualCourses.length} courses (${bundleCourse.module_count} modules total)`,
                  "Lifetime access · Every future update included",
                  "30-day money-back guarantee",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-[14px] text-white/85">
                    <Check size={15} className="text-gold shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-baseline gap-3">
                {bundleCourse.original_price_cents && (
                  <span className="text-[20px] text-white/40 line-through tabular-nums">
                    {formatPrice(bundleCourse.original_price_cents)}
                  </span>
                )}
                <span className="text-[42px] md:text-[48px] font-bold text-gold tabular-nums leading-none">
                  {formatPrice(bundleCourse.price_cents)}
                </span>
                {recommendation.bundleSavingsCents > 0 && (
                  <span className="text-[12px] font-semibold uppercase tracking-widest text-gold/80 bg-gold/10 border border-gold/30 px-2.5 py-1 rounded">
                    Save {formatPrice(recommendation.bundleSavingsCents)}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <CourseThumbnail
                category={bundleCourse.category}
                title={bundleCourse.title}
                level="All access"
                size="lg"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Choice toggle — bundle vs individual */}
      {recommendation.showBundle && bundleCourse && (
        <div className="bg-surface rounded-2xl p-1.5 grid grid-cols-2 max-w-lg mx-auto mb-8">
          <button
            onClick={() => setChoice("bundle")}
            className={`py-3 px-4 text-[13.5px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              choice === "bundle"
                ? "bg-gold text-navy shadow-sm"
                : "text-muted-foreground hover:text-navy"
            }`}
          >
            All courses
            <span className="text-[10px] font-bold opacity-70">
              {formatPrice(bundleCourse.price_cents)}
            </span>
          </button>
          <button
            onClick={() => setChoice("individual")}
            className={`py-3 px-4 text-[13.5px] font-semibold rounded-xl transition-all ${
              choice === "individual"
                ? "bg-white text-navy shadow-sm"
                : "text-muted-foreground hover:text-navy"
            }`}
          >
            Just {recommendation.courses.length} for me
          </button>
        </div>
      )}

      {/* Selected courses */}
      <motion.div
        key={choice}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 mb-8"
      >
        {choice === "bundle" && bundleCourse ? (
          <div className="card-base p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold">
                Everything Included
              </p>
              <span className="text-[12px] text-muted-foreground tabular-nums">
                {allIndividualCourses.length} courses · {bundleCourse.module_count} modules
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {allIndividualCourses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 text-[14px]">
                  <div className="w-8 h-8 rounded-md bg-gold-subtle border border-gold-tint flex items-center justify-center shrink-0">
                    <Check size={13} className="text-gold" strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy truncate text-[14px]">{c.title}</p>
                    <p className="text-[11.5px] text-muted-foreground tabular-nums">
                      {c.duration_hours}h · {c.module_count} modules · {LEVEL_LABEL[c.level]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedCourses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              className="card-base p-4 grid md:grid-cols-[160px_1fr_auto] gap-5 items-center"
            >
              <CourseThumbnail category={c.category} title={c.title} size="sm" />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-gold bg-gold-subtle border border-gold-tint px-2 py-0.5 rounded">
                    {CATEGORY_LABEL[c.category]}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{LEVEL_LABEL[c.level]}</span>
                </div>
                <h3 className="mb-1">{c.title}</h3>
                <p className="text-[14px] text-muted-foreground mb-2 line-clamp-2">{c.subtitle}</p>
                <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {c.duration_hours}h
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={12} />
                    {c.module_count} modules
                  </span>
                </div>
              </div>
              <div className="text-right">
                {c.original_price_cents && (
                  <p className="text-[13px] text-muted-foreground line-through tabular-nums">
                    {formatPrice(c.original_price_cents)}
                  </p>
                )}
                <p className="text-[22px] font-bold text-navy tabular-nums leading-none">
                  {formatPrice(c.price_cents)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Order summary + Pay */}
      <div className="bg-navy text-white rounded-3xl p-8 md:p-10">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-gold mb-3">
              Order Summary
            </p>
            <h2 className="text-white! mb-4">
              {selectedCourses.length === 1
                ? selectedCourses[0].title
                : `${selectedCourses.length} courses`}
            </h2>

            <ul className="space-y-2.5 mb-6">
              {[
                "Lifetime access to all included modules",
                "Downloadable CPA-built handouts",
                "30-day money-back guarantee",
                "Secure payment via Stripe",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[14px] text-white/80">
                  <Check size={14} className="text-gold shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[13px] text-white/60">Subtotal</span>
                <span className="text-[15px] font-semibold text-white tabular-nums">
                  {formatPrice(totalCents)}
                </span>
              </div>
              {choice === "bundle" && recommendation.bundleSavingsCents > 0 && (
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[13px] text-white/60">Bundle savings</span>
                  <span className="text-[14px] font-semibold text-gold tabular-nums">
                    −{formatPrice(recommendation.bundleSavingsCents)}
                  </span>
                </div>
              )}
              <div className="border-t border-white/10 my-3" />
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-white font-semibold">Total today</span>
                <span className="text-[28px] font-bold text-white tabular-nums leading-none">
                  {formatPrice(totalCents)}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/15 border border-destructive/30 rounded-xl p-3 text-[13px] text-white">
                {error}
              </div>
            )}

            <motion.button
              onClick={handlePay}
              disabled={paying}
              whileHover={{ scale: paying ? 1 : 1.02 }}
              whileTap={{ scale: paying ? 1 : 0.98 }}
              className="btn-gold hover:btn-gold-hover w-full text-[15px]! min-h-[56px]! disabled:opacity-70"
            >
              {paying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Starting checkout…
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay {formatPrice(totalCents)} securely
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <Shield size={11} />
                Stripe-secured
              </span>
              <span>·</span>
              <span>Visa · Mastercard · Amex</span>
            </div>
          </div>
        </div>
      </div>

      {!directCourse && (
        <div className="text-center mt-8">
          <button
            onClick={onRetake}
            className="text-[13px] font-semibold text-muted-foreground hover:text-navy transition-colors"
          >
            Want different recommendations? Retake the intake →
          </button>
        </div>
      )}

      <p className="mt-6 text-[12px] text-muted-foreground text-center">
        Sending a receipt to <strong>{lead.email}</strong>
      </p>
    </div>
  );
}

// ===== Direct Enroll View =====
// Used when the URL has ?course=<slug>. Single screen: course summary,
// email + name form, one button straight to Stripe Checkout.

function DirectEnrollView({
  course,
  initialLead,
  source,
  onLeadSaved,
}: {
  course: Course;
  initialLead: Lead | null;
  source: string;
  onLeadSaved: (lead: Lead) => void;
}) {
  const [name, setName] = useState(initialLead?.name ?? "");
  const [email, setEmail] = useState(initialLead?.email ?? "");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canBuyDirect = isStripeConfigured() && !!course.stripe_price_id;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    const lead: Lead = { name: trimmedName, email: trimmedEmail, phone: "" };
    onLeadSaved(lead);

    setPaying(true);
    try {
      await persistLeadToSupabase(lead, { source: `enroll:${source}:${course.slug}` });

      if (!isStripeConfigured()) {
        setError(
          "Payment isn't configured yet. Set VITE_STRIPE_PUBLISHABLE_KEY in .env and deploy the create-checkout-session Edge Function.",
        );
        setPaying(false);
        return;
      }

      await redirectToStripeCheckout({
        lineItems: [
          {
            name: course.title,
            description: course.subtitle,
            amountCents: course.price_cents,
            priceId: course.stripe_price_id ?? undefined,
          },
        ],
        customerEmail: trimmedEmail,
        successPath: "/success",
        cancelPath: "/cancel",
        metadata: { course_slug: course.slug, source: `enroll:${source}` },
      });
    } catch (err) {
      console.error("[direct-enroll]", err);
      setError(err instanceof Error ? err.message : "Payment couldn't start. Please try again.");
      setPaying(false);
    }
  }

  return (
    <div className="max-w-[760px] mx-auto">
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-start">
        {/* Course summary */}
        <aside className="card-base p-3 md:sticky md:top-24">
          <CourseThumbnail
            category={course.category}
            title={course.title}
            level={LEVEL_LABEL[course.level]}
            size="md"
          />
          <div className="px-3 pt-4 pb-3">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold bg-gold-subtle border border-gold-tint px-2.5 py-1 rounded inline-block mb-3">
              {CATEGORY_LABEL[course.category]}
            </span>
            <h3 className="mb-2">{course.title}</h3>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">
              {course.subtitle}
            </p>
            <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-border">
              {course.original_price_cents && (
                <span className="text-[14px] text-muted-foreground line-through tabular-nums">
                  {formatPrice(course.original_price_cents)}
                </span>
              )}
              <span className="text-[28px] font-bold text-navy tabular-nums leading-none">
                {formatPrice(course.price_cents)}
              </span>
              <span className="text-[12px] text-muted-foreground ml-1">one-time</span>
            </div>
            <ul className="space-y-2 text-[13px] text-foreground">
              <li className="flex items-center gap-2">
                <Shield size={14} className="text-gold shrink-0" />
                30-day money-back guarantee
              </li>
              <li className="flex items-center gap-2">
                <BookOpen size={14} className="text-gold shrink-0" />
                Lifetime access + future updates
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold shrink-0" />
                {course.duration_hours}h · {course.module_count} modules
              </li>
            </ul>
          </div>
        </aside>

        {/* Email + pay form */}
        <div>
          <p className="eyebrow mb-3">You're one step away</p>
          <h1 className="mb-3">Enroll in {course.title}.</h1>
          <p className="text-[15.5px] text-muted-foreground leading-relaxed mb-7">
            Tell us where to send your receipt and course access — then you'll be redirected to
            secure checkout.
          </p>

          <form onSubmit={handlePay} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="direct-name"
                className="block text-[13px] font-semibold text-navy"
              >
                Full name
              </label>
              <input
                id="direct-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                disabled={paying}
                required
                className="input-base focus:input-base-focus w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="direct-email"
                className="block text-[13px] font-semibold text-navy"
              >
                Email
              </label>
              <input
                id="direct-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                autoComplete="email"
                disabled={paying}
                required
                className="input-base focus:input-base-focus w-full"
              />
              <p className="text-[12px] text-muted-foreground">
                We'll send your receipt and course access here.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="text-[13px] text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={paying}
              className="btn-gold hover:btn-gold-hover w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {paying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting to secure checkout…
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Continue to payment · {formatPrice(course.price_cents)}
                </>
              )}
            </button>

            <p className="text-center text-[12px] text-muted-foreground">
              Powered by Stripe · Your card details never touch our servers.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[13px] text-muted-foreground">
              Not sure if this is the right course?{" "}
              <Link to="/intake" className="font-semibold text-navy hover:text-gold">
                Take the 60-second intake instead.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
