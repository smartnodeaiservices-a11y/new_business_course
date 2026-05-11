import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Loader2,
  MapPin,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isValidEmail } from "@/lib/lead";
import { usePageMeta } from "@/lib/page-meta";

export default function ContactPage() {
  usePageMeta({
    title: "Contact us — New Business Course",
    description: "Questions about courses, billing, or which one fits your business? Reach out.",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!email.trim()) next.email = "Please enter your email";
    else if (!isValidEmail(email)) next.email = "That email doesn't look right";
    if (!message.trim()) next.message = "Please write a quick note";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setError(null);
    try {
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        message: message.trim(),
        source: "contact-page",
      });
      if (dbError) throw dbError;
      setSent(true);
    } catch (err) {
      console.error("[contact] submit failed", err);
      setError(
        "Something went wrong sending your message. Please try email instead: hello@newbusinesscourse.com",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12 max-w-2xl mx-auto"
      >
        <span className="chip mb-5 mx-auto">
          <MessageCircle size={13} />
          We reply within a few hours
        </span>
        <h1 className="mb-4">Talk to a real human.</h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed">
          Questions about which course fits your business? Billing? Tax-strategy curiosity? Drop a
          note and we'll get back fast.
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card-base p-8"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 border-2 border-success/30 mb-5">
                <CheckCircle2 size={28} className="text-success" />
              </div>
              <h2 className="text-[28px]! mb-2">Message sent.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                We'll get back to <strong>{email}</strong> within a few hours. Usually faster.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setMessage("");
                }}
                className="text-[13px] font-semibold text-navy hover:text-gold"
              >
                Send another →
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" error={fieldErrors.name}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="input-base focus:input-base-focus"
                  />
                </Field>
                <Field label="Email" error={fieldErrors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    autoComplete="email"
                    className="input-base focus:input-base-focus"
                  />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  className="input-base focus:input-base-focus"
                />
              </Field>
              <Field label="What's on your mind?" error={fieldErrors.message}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us about your business or what you're hoping to learn — we'll point you to the right course."
                  className="input-base focus:input-base-focus resize-y"
                />
              </Field>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.01 }}
                whileTap={{ scale: sending ? 1 : 0.99 }}
                className="btn-gold hover:btn-gold-hover w-full min-h-[52px]! disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send message
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Sidebar info */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-4"
        >
          <InfoCard
            icon={Mail}
            label="Email"
            primary="hello@newbusinesscourse.com"
            sub="Best for detailed questions"
          />
          <InfoCard
            icon={Phone}
            label="Phone"
            primary="+1 (305) 555-0144"
            sub="Mon–Fri · 9am–5pm ET"
          />
          <InfoCard
            icon={MapPin}
            label="Office"
            primary="Miami, Florida"
            sub="Serving owners nationwide"
          />
          <InfoCard
            icon={Clock}
            label="Response time"
            primary="Within a few hours"
            sub="Same business day, usually faster"
          />

          <div className="bg-navy text-white rounded-2xl p-6 mt-6">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold mb-2">
              Pro tip
            </p>
            <h4 className="text-white! mb-2">Not sure which course fits?</h4>
            <p className="text-[13.5px] text-white/70 leading-relaxed mb-4">
              Take the 60-second intake first — we'll recommend the right courses for your business,
              and you can ask us about the recommendation.
            </p>
            <a
              href="/intake"
              className="text-[13px] font-semibold text-gold hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              Start the intake →
            </a>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-navy mb-1.5">{label}</span>
      {children}
      {error && <p className="mt-1.5 text-[12px] text-destructive font-medium">{error}</p>}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  primary,
  sub,
}: {
  icon: typeof Mail;
  label: string;
  primary: string;
  sub: string;
}) {
  return (
    <div className="card-base p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-gold-subtle border border-gold-tint flex items-center justify-center shrink-0">
        <Icon size={17} className="text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-[14.5px] font-semibold text-navy truncate">{primary}</p>
        <p className="text-[12.5px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
