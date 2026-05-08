import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/enroll")({
  head: () => ({
    meta: [
      { title: "Enroll — $149 One-Time · Lifetime Access" },
      { name: "description", content: "One payment. Lifetime access to 15 CPA-built modules. 30-day savings guarantee." },
      { property: "og:title", content: "Enroll — New Business Course" },
      { property: "og:description", content: "$149 one-time. Instant access. 30-day guarantee." },
    ],
  }),
  component: EnrollPage,
});

function EnrollPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <section className="px-6 py-20">
      <div className="max-w-[980px] mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        {/* Left: pitch */}
        <div>
          <p className="eyebrow mb-3">Enroll Today</p>
          <h1 className="text-[40px] sm:text-[52px] mb-4">
            One payment.
            <br />
            <em className="font-light text-[var(--gold)]">Lifetime access.</em>
          </h1>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md">
            The Business Owner Profit Playbook — 15 modules built by a 20+ year CPA.
            Pay once. Use forever. Save thousands.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              "15 CPA-built modules · video, slides & handouts",
              "Step-by-step action items in every unit",
              "Lifetime access · self-paced",
              "Stripe & PayPal accepted · instant access",
              "30-day savings guarantee",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-[var(--foreground)]">
                <span className="w-5 h-5 rounded-full bg-[var(--gold-tint)] border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] text-[11px] font-bold mt-0.5 flex-shrink-0">✓</span>
                {t}
              </li>
            ))}
          </ul>

          <div className="bg-[var(--navy)] text-white rounded-lg p-6 max-w-sm">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1">Conservative year-1 savings</p>
            <p className="font-display font-light text-[44px] text-[var(--gold)] leading-none">$20,000+</p>
            <p className="text-[12px] text-white/45 mt-2">Documented across all 15 modules.</p>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white border border-[var(--surface)] rounded-lg p-8 lg:sticky lg:top-24 shadow-[0_2px_24px_rgba(27,47,94,0.06)]">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-[var(--gold-tint)] border-2 border-[var(--gold)] flex items-center justify-center text-[var(--success)] text-2xl mb-5">✓</div>
              <h2 className="text-[28px] mb-2">You're enrolled.</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Check <strong>{form.email}</strong> — your login and course link arrive within 2 minutes.
              </p>
              <div className="text-left space-y-2 text-[13px] text-[var(--success)] font-medium bg-[var(--gold-subtle)] rounded-md p-4">
                <p>✓ Payment confirmed</p>
                <p>✓ Account created</p>
                <p>✓ Email sent</p>
              </div>
              <Link to="/" className="inline-block mt-6 text-[13px] text-[var(--navy)] underline">Back to home</Link>
            </div>
          ) : (
            <>
              <div className="bg-[var(--gold-tint)] border border-[var(--gold)] rounded-md p-4 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--navy)]">Profit Playbook</p>
                  <p className="text-[11px] text-[var(--navy)]/70">15 modules · Lifetime</p>
                </div>
                <span className="font-display font-light text-[36px] text-[var(--navy)]">$149</span>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                <input
                  required
                  placeholder="Full name"
                  className="w-full bg-[var(--warm-white)] border border-[var(--surface)] rounded-md px-4 py-3.5 text-[15px] outline-none focus:border-[var(--navy)] transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[var(--warm-white)] border border-[var(--surface)] rounded-md px-4 py-3.5 text-[15px] outline-none focus:border-[var(--navy)] transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <button type="submit" className="btn-navy w-full">
                  Enroll Now — $149 One-Time
                </button>
                <p className="text-[12px] text-[var(--muted-foreground)] text-center mt-3 leading-relaxed">
                  Stripe & PayPal accepted · Instant course access · 30-day savings guarantee.
                  <br />
                  Your information is never sold or shared.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
