import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  Copy,
  DollarSign,
  Gift,
  Loader2,
  Share2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { usePageMeta } from "@/lib/page-meta";
import {
  claimReferral,
  fetchReferralByCode,
  formatCents,
  readReferralCode,
  shareableUrl,
  type Referral,
} from "@/lib/referral";
import { COURSE_META } from "@/lib/curriculum";

const schema = z.object({
  name: z.string().min(2, "Tell us your first name"),
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export default function ReferPage() {
  usePageMeta({
    title: `Refer a friend, earn $25 — ${COURSE_META.brand}`,
    description: `Share ${COURSE_META.productTitle} and earn $25 cash for every friend who enrolls. They save $25 too.`,
  });

  const [referral, setReferral] = useState<Referral | null>(null);
  const [referrer, setReferrer] = useState<Referral | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const invitedByCode = readReferralCode();
      const { referral } = await claimReferral(values.email, values.name, invitedByCode);
      setReferral(referral);

      // Show "you were invited by X" — prefer the code the new user actually
      // landed on (in localStorage), fall back to whatever the DB linked.
      const lookup = invitedByCode || referral.referred_by_code || null;
      if (lookup) {
        const r = await fetchReferralByCode(lookup);
        if (r && r.code !== referral.code) setReferrer(r);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't claim a code. Try again.");
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
                <Gift size={12} />
                Refer & earn
              </span>
              <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3.25rem)]! leading-[1.05]!">
                Earn <span className="text-gold">$25</span> for every friend who enrolls.
              </h1>
              <p className="text-[16.5px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
                Send your link to another business owner. When they enroll in{" "}
                {COURSE_META.productTitle}, they save $25 and you earn $25 cash — paid out after the
                30-day refund window.
              </p>
              <ul className="space-y-2 mb-6 max-w-md">
                {[
                  "$25 off for them, $25 cash for you",
                  "Unlimited referrals — no cap",
                  "Paid 31 days after their enrollment via Stripe",
                  "Track conversions on this page anytime",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[14.5px] text-foreground">
                    <Check size={16} className="text-gold mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp}>
              {!referral ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="card-base p-6 md:p-7 bg-white shadow-[0_12px_40px_rgba(11,26,58,0.08)]"
                  noValidate
                >
                  <p className="eyebrow mb-2 text-gold!">Claim your code</p>
                  <h3 className="text-[22px]! mb-4">Get your referral link.</h3>

                  <div className="space-y-3 mb-3">
                    <Field label="Your first name" error={form.formState.errors.name?.message}>
                      <input
                        type="text"
                        autoComplete="given-name"
                        {...form.register("name")}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Email" error={form.formState.errors.email?.message}>
                      <input
                        type="email"
                        autoComplete="email"
                        {...form.register("email")}
                        className="input-base"
                      />
                    </Field>
                  </div>

                  {error && <p className="text-[13px] text-alert mb-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="btn-gold hover:btn-gold-hover w-full"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Allocating your code…
                      </>
                    ) : (
                      <>
                        Get my referral link
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="text-[11.5px] text-muted-foreground text-center mt-4">
                    Returning? Submit the same email — we'll give you the same code.
                  </p>
                </form>
              ) : (
                <ReferralDashboard
                  referral={referral}
                  referrer={referrer}
                  copied={copied}
                  setCopied={setCopied}
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-[26px]! md:text-[28px]! mb-3">Three steps. No tracking pixels.</h2>
          </motion.div>
          <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card-base p-6 bg-white">
                <span className="text-[28px] font-bold text-gold tabular-nums leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-3 mb-2">{s.title}</h4>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed m-0!">{s.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Fine print */}
      <section className="bg-warm-white border-t border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 py-14">
          <motion.div {...fadeUp}>
            <p className="eyebrow mb-3">Fine print</p>
            <h2 className="text-[22px]! mb-4">The honest version.</h2>
            <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
              <li>
                Conversions are marked <strong className="text-navy">pending</strong> until the
                30-day refund window passes. After that they move to{" "}
                <strong className="text-navy">confirmed</strong> and become eligible for payout.
              </li>
              <li>
                Payouts go to the email on file via Stripe or PayPal. Anything under $25 rolls
                forward to the next month.
              </li>
              <li>
                Self-referrals (using your own code on your own enrollment) are detected and
                excluded.
              </li>
              <li>
                We don't share your email with anyone you refer — only your first name appears on
                the landing page.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function ReferralDashboard({
  referral,
  referrer,
  copied,
  setCopied,
}: {
  referral: Referral;
  referrer: Referral | null;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const url = shareableUrl(referral.code);
  const referrerUrl = referrer ? shareableUrl(referrer.code) : null;
  const referrerName = referrer?.owner_name?.split(" ")[0] || "A business owner";

  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  }

  function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "New Business Course",
          text: `Save $25 on the New Business Course with my link:`,
          url,
        })
        .catch(() => undefined);
    } else {
      copy(url);
    }
  }

  return (
    <div className="card-base p-6 md:p-7 bg-white shadow-[0_12px_40px_rgba(11,26,58,0.08)] space-y-5">
      {referrer && referrerUrl && (
        <div className="card-base p-4 bg-navy/5 border-navy/10">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1 inline-flex items-center gap-1.5">
            <UserCheck size={13} className="text-navy" />
            You were invited by
          </div>
          <div className="text-[15px] font-semibold text-navy">
            {referrerName}
            <span className="text-muted-foreground font-normal"> · code </span>
            <span className="tabular-nums tracking-[0.06em]">{referrer.code}</span>
          </div>
          <div className="text-[12px] text-muted-foreground mt-1 font-mono truncate">
            {referrerUrl}
          </div>
        </div>
      )}

      <div>
        <p className="eyebrow mb-2 text-gold!">Your link</p>
        <h3 className="text-[22px]! mb-4">Send this to other business owners.</h3>
      </div>

      <div className="card-base p-4 bg-gold-subtle border-gold-tint">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">
          Your code
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[28px] font-bold text-navy tabular-nums tracking-[0.08em]">
            {referral.code}
          </span>
          <button
            type="button"
            onClick={() => copy(referral.code)}
            className="btn-ghost hover:btn-ghost-hover text-[12px]!"
            aria-label="Copy code"
          >
            <Copy size={13} />
            Copy
          </button>
        </div>
      </div>

      <div>
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">
          Shareable link
        </div>
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            readOnly
            value={url}
            className="input-base flex-1 text-[12.5px]! font-mono"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            onClick={() => copy(url)}
            className="btn-gold hover:btn-gold-hover px-4!"
            aria-label="Copy link"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          type="button"
          onClick={share}
          className="btn-outline hover:btn-outline-hover mt-3 w-full text-[13px]!"
        >
          <Share2 size={14} />
          Share
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
        <Stat
          label="Enrollments"
          value={referral.count.toLocaleString()}
          icon={<Sparkles size={14} className="text-gold" />}
        />
        <Stat
          label="Earned"
          value={formatCents(referral.total_earned_cents)}
          icon={<DollarSign size={14} className="text-gold" />}
        />
      </div>
      <p className="text-[11.5px] text-muted-foreground text-center">
        Confirmed earnings move to{" "}
        <span className="text-success font-semibold">payout-eligible</span> 31 days after each
        enrollment.
      </p>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card-base p-4 bg-white">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="text-[22px] font-bold text-navy tabular-nums mt-1">{value}</div>
    </div>
  );
}

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

const STEPS = [
  {
    title: "Claim your code",
    body: "Enter your name and email. We generate a unique link tied to your email — same email always returns the same link.",
  },
  {
    title: "Share with owners",
    body: "DM, email, SMS, anywhere. When someone clicks your link they see your name and an automatic $25 discount.",
  },
  {
    title: "Earn $25 per enrollment",
    body: "We track the conversion on /success. After the 30-day refund window we mark it confirmed and queue your payout.",
  },
];
