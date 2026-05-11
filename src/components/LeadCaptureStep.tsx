import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { isValidEmail, type Lead } from "@/lib/lead";

export type LeadCaptureStepProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  initialLead?: Lead | null;
  onSubmit: (lead: Lead) => void;
  /** Optional trailing element (e.g. trust badges). */
  footer?: React.ReactNode;
};

export function LeadCaptureStep({
  title = "Let's start with the basics.",
  subtitle = "Just three quick details so we can send you your plan and keep your seat. No spam — ever.",
  ctaLabel = "Continue",
  initialLead,
  onSubmit,
  footer,
}: LeadCaptureStepProps) {
  const [name, setName] = useState(initialLead?.name ?? "");
  const [email, setEmail] = useState(initialLead?.email ?? "");
  const [phone, setPhone] = useState(initialLead?.phone ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});

  function validate(): boolean {
    const next: Partial<Record<keyof Lead, string>> = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!email.trim()) next.email = "Please enter your email";
    else if (!isValidEmail(email)) next.email = "That email doesn't look right";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      className="max-w-[560px] mx-auto"
    >
      <header className="mb-8 text-center">
        <span className="chip mb-5 mx-auto">
          <Lock size={13} />
          Private · Takes 20 seconds
        </span>
        <h1 className="mb-3">{title}</h1>
        <p className="text-[16px] text-muted-foreground leading-relaxed">{subtitle}</p>
      </header>

      <form onSubmit={submit} className="card-base p-7 space-y-5">
        <LabeledField icon={User} label="Full name" required error={errors.name}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marcus Johnson"
            autoComplete="name"
            className="input-base focus:input-base-focus"
          />
        </LabeledField>

        <LabeledField
          icon={Mail}
          label="Email"
          required
          error={errors.email}
          hint="We send your plan and login here."
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            autoComplete="email"
            className="input-base focus:input-base-focus"
          />
        </LabeledField>

        <LabeledField
          icon={Phone}
          label="Phone"
          hint="Optional — only used if your enrollment needs attention."
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            autoComplete="tel"
            className="input-base focus:input-base-focus"
          />
        </LabeledField>

        <button type="submit" className="btn-gold hover:btn-gold-hover w-full mt-2">
          {ctaLabel}
          <ArrowRight size={16} />
        </button>

        <p className="text-[12px] text-muted-foreground text-center leading-relaxed">
          <Lock size={11} className="inline -mt-0.5 mr-1" />
          Your information is never sold or shared. 30-day money-back guarantee.
        </p>
      </form>

      {footer && <div className="mt-6">{footer}</div>}
    </motion.div>
  );
}

function LabeledField({
  icon: Icon,
  label,
  required,
  error,
  hint,
  children,
}: {
  icon: typeof User;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-navy">
          <Icon size={13} className="text-gold" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-destructive font-medium">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
