import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Award, Check, Clock, Quote, Shield, Star } from "lucide-react";
import {
  FOUNDATIONS_CURRICULUM,
  FOUNDATIONS_FAQ,
  FOUNDATIONS_OUTCOMES,
  FOUNDATIONS_TESTIMONIALS,
  INSTRUCTOR,
} from "@/lib/landing-content";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

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
        <motion.div {...fadeUp} className="space-y-3">
          {FOUNDATIONS_CURRICULUM.map((m) => (
            <div
              key={m.n}
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
            </div>
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
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            {FOUNDATIONS_OUTCOMES.map((o) => (
              <li
                key={o}
                className="flex items-start gap-3 text-[14.5px] text-foreground leading-relaxed"
              >
                <div className="w-6 h-6 rounded-full bg-(--gold)/15 border border-(--gold)/40 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={13} className="text-gold" strokeWidth={3} />
                </div>
                {o}
              </li>
            ))}
          </ul>
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
        <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-4">
          {FOUNDATIONS_TESTIMONIALS.map((t) => (
            <div key={t.name} className="card-base p-6 bg-white">
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
            </div>
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
        <motion.div {...fadeUp}>
          <Accordion type="single" collapsible className="space-y-3">
            {FOUNDATIONS_FAQ.map((f, i) => (
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
