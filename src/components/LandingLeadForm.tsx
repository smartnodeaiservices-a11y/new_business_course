import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Mail, User as UserIcon } from "lucide-react";
import { isValidEmail, persistLeadToSupabase, writeLead } from "@/lib/lead";

type LandingLeadFormProps = {
  /** Funnel variant slug (e.g. "lp-v1") — gets tagged in GHL/Supabase for attribution. */
  variant: string;
  /** Course slug to enroll on submit. */
  courseSlug: string;
  /** Headline above the form. */
  title?: string;
  /** Smaller line below the headline. */
  subtitle?: string;
  /** Submit button label. */
  ctaLabel?: string;
};

export function LandingLeadForm({
  variant,
  courseSlug,
  title = "Get started — $149 today",
  subtitle = "Enter your details. We'll send your receipt and starter handout the moment you enroll.",
  ctaLabel = "Continue to checkout",
}: LandingLeadFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!isValidEmail(email)) return setError("Please enter a valid email.");

    setSubmitting(true);
    const lead = { name: name.trim(), email: email.trim(), phone: "" };
    writeLead(lead);
    await persistLeadToSupabase(lead, { source: variant });
    setSubmitting(false);
    navigate(
      `/enroll?course=${encodeURIComponent(courseSlug)}&utm_source=${encodeURIComponent(
        variant,
      )}&variant=${encodeURIComponent(variant)}`,
    );
  }

  return (
    <form
      onSubmit={submit}
      className="card-base p-6 md:p-7 shadow-[0_12px_40px_rgba(11,26,58,0.08)]"
    >
      <h3 className="text-[20px]! mb-1">{title}</h3>
      <p className="text-[13.5px] text-muted-foreground mb-5">{subtitle}</p>

      <div className="space-y-3 mb-4">
        <label className="block">
          <span className="sr-only">Your name</span>
          <div className="relative">
            <UserIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-white text-[14.5px] focus:outline-none focus:border-gold focus:ring-2 focus:ring-(--gold)/20"
              autoComplete="name"
            />
          </div>
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-white text-[14.5px] focus:outline-none focus:border-gold focus:ring-2 focus:ring-(--gold)/20"
              autoComplete="email"
            />
          </div>
        </label>
      </div>

      {error && (
        <p className="text-[13px] text-(--destructive,#b91c1c) mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold hover:btn-gold-hover w-full min-h-[50px]! text-[15px]! disabled:opacity-70"
      >
        {submitting ? "Saving…" : ctaLabel}
        <ArrowRight size={16} />
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Lock size={12} />
          Secure checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-success" />
          30-day refund
        </span>
      </div>
    </form>
  );
}
