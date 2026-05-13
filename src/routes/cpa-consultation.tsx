import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Check, Loader2, Phone, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CPA_CONSULTATION, COURSE_META } from "@/lib/curriculum";
import { usePageMeta } from "@/lib/page-meta";
import {
  isStripeConfigured,
  redirectToStripeCheckout,
  StripeNotConfiguredError,
} from "@/lib/stripe";
import { persistLeadToSupabase, writeLead } from "@/lib/lead";
import { readReferralCode } from "@/lib/referral";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("A real email so we can send the calendar invite"),
  phone: z.string().optional(),
  topic: z
    .string()
    .min(8, "A sentence or two so the CPA can prep")
    .max(600, "Keep it under 600 characters"),
});

type FormValues = z.infer<typeof schema>;

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export default function CpaConsultationPage() {
  usePageMeta({
    title: `1-on-1 CPA Consultation — ${CPA_CONSULTATION.priceLabel}/hr`,
    description: `${CPA_CONSULTATION.subtitle} The one paid add-on for ${COURSE_META.brand} students.`,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", topic: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSubmitting(true);
    try {
      const lead = { name: values.name, email: values.email, phone: values.phone ?? "" };
      writeLead(lead);
      await persistLeadToSupabase(lead, {
        source: "cpa-consultation",
        pain: values.topic.slice(0, 480),
      });
      if (!isStripeConfigured()) throw new StripeNotConfiguredError();
      const referralCode = readReferralCode();
      await redirectToStripeCheckout({
        customerEmail: values.email,
        lineItems: [
          {
            name: CPA_CONSULTATION.title,
            description: `${CPA_CONSULTATION.subtitle} — Topic: ${values.topic.slice(0, 180)}`,
            amountCents: CPA_CONSULTATION.priceCents,
            priceId: CPA_CONSULTATION.stripePriceId,
            quantity: 1,
          },
        ],
        successPath: "/success?product=cpa-consultation",
        cancelPath: "/cpa-consultation",
        metadata: {
          product: "cpa-consultation",
          topic: values.topic.slice(0, 480),
          ...(referralCode ? { referral_code: referralCode } : {}),
        },
      });
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't start checkout. Please try again or email us.",
      );
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-warm-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-14">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
            <motion.div {...fadeUp}>
              <span className="chip mb-5">
                <Phone size={12} />
                The only paid add-on
              </span>
              <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3.25rem)]! leading-[1.05]!">
                1-on-1 CPA consultation
                <br className="hidden sm:block" />
                <span className="text-gold">{CPA_CONSULTATION.priceLabel}</span>
                <span className="text-muted-foreground text-[0.55em] font-light"> / hour</span>.
              </h1>
              <p className="text-[16px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
                {CPA_CONSULTATION.description}
              </p>
              <ul className="space-y-2 mb-6 max-w-md">
                {CPA_CONSULTATION.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[14.5px] text-foreground">
                    <Check size={16} className="text-gold mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-[12.5px] text-muted-foreground inline-flex items-center gap-1.5">
                <Shield size={13} className="text-gold" />
                Pay only when you book — no retainer, no auto-renew.
              </p>
            </motion.div>

            <motion.div {...fadeUp}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="card-base p-6 md:p-7 bg-white shadow-[0_12px_40px_rgba(11,26,58,0.08)]"
                noValidate
              >
                <p className="eyebrow mb-2 text-gold!">Book your hour</p>
                <h3 className="text-[22px]! mb-4">
                  {CPA_CONSULTATION.priceLabel} · charged at checkout
                </h3>

                <div className="space-y-3 mb-3">
                  <Field label="Your name" error={form.formState.errors.name?.message}>
                    <input
                      type="text"
                      autoComplete="name"
                      {...form.register("name")}
                      className="input-base"
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Email" error={form.formState.errors.email?.message}>
                      <input
                        type="email"
                        autoComplete="email"
                        {...form.register("email")}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Phone (optional)">
                      <input
                        type="tel"
                        autoComplete="tel"
                        {...form.register("phone")}
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <Field
                    label="What do you want to cover?"
                    error={form.formState.errors.topic?.message}
                  >
                    <textarea
                      rows={4}
                      {...form.register("topic")}
                      className="input-base resize-y"
                      placeholder="Entity review, tax position, S-Corp election timing, hiring questions, etc."
                    />
                  </Field>
                </div>

                {error && (
                  <p className="text-[13px] text-alert mb-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold hover:btn-gold-hover w-full min-h-[50px]! text-[15px]! disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Starting checkout…
                    </>
                  ) : (
                    <>
                      Pay {CPA_CONSULTATION.priceLabel} & schedule
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Shield size={12} />
                    Secure checkout via Stripe
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} className="text-gold" />
                    Calendar invite sent after payment
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-[26px]! md:text-[28px]! mb-3">
              Three steps. One hour. Done.
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card-base p-6 bg-white">
                <span className="text-[28px] font-bold text-gold tabular-nums leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-3 mb-2">{s.title}</h4>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0!">
                  {s.body}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

const STEPS = [
  {
    title: "Pay & describe",
    body: `${CPA_CONSULTATION.priceLabel} via Stripe. Tell us in a sentence or two what you want to cover so the CPA can prep.`,
  },
  {
    title: "Book a slot",
    body: "We send back a calendar link within one business day with the next available slots — usually inside 72 hours.",
  },
  {
    title: "Get the action list",
    body: "After the call you receive a one-page written action list — what to change, what to file, and when.",
  },
];

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-navy uppercase tracking-[0.08em] block mb-1.5">
        {label}
      </span>
      {children}
      {error && <span className="text-[12px] text-alert mt-1 block">{error}</span>}
    </label>
  );
}
