import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Mail, BookOpen, Calendar, Gift } from "lucide-react";
import { readLead, clearLead } from "@/lib/lead";
import { usePageMeta } from "@/lib/page-meta";
import { useEffect, useState } from "react";
import { clearReferralCode, readReferralCode, recordConversion } from "@/lib/referral";
import { supabase } from "@/integrations/supabase/client";

export default function SuccessPage() {
  usePageMeta({ title: "You're enrolled — New Business Course" });

  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const lead = readLead();

  // Referral attribution — fire-and-forget. Status surfaces in UI so the
  // referrer (when buying via their own link, future use case) sees it
  // didn't silently fail.
  const [referralStatus, setReferralStatus] = useState<
    "idle" | "recording" | "recorded" | "already" | "skipped" | "error"
  >("idle");

  useEffect(() => {
    const code = readReferralCode();
    if (!sessionId || !code) {
      setReferralStatus("skipped");
      return;
    }
    let cancelled = false;
    setReferralStatus("recording");
    recordConversion(sessionId, code).then((res) => {
      if (cancelled) return;
      if (res.alreadyRecorded) setReferralStatus("already");
      else if (res.recorded) setReferralStatus("recorded");
      else setReferralStatus("error");
      // Either way, clear the code so it isn't double-applied on a later purchase.
      clearReferralCode();
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // GHL sync — fire when /success loads. We trust the upstream Stripe redirect
  // (no server-side verification needed here) and just push the saved lead +
  // Stripe session id to GHL. Idempotent: the function won't create a second
  // opportunity if the email is already in the pipeline; it'll just upsert
  // the contact and mark paid_at in supabase.
  useEffect(() => {
    if (!lead?.email) return;
    let cancelled = false;
    supabase.functions
      .invoke("push-to-ghl", {
        body: {
          email: lead.email,
          name: lead.name,
          phone: lead.phone,
          status: "paid",
          source: "checkout",
          stripeSessionId: sessionId ?? null,
          extraTags: ["paid", ...(sessionId ? [] : ["no-session-id"])],
        },
      })
      .then(({ error }) => {
        if (cancelled) return;
        if (error) console.warn("[ghl] sync failed:", error.message);
      })
      .catch((err) => {
        if (!cancelled) console.warn("[ghl] sync failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [lead?.email, lead?.name, lead?.phone, sessionId]);

  useEffect(() => {
    // Free the lead from session storage once they've completed the flow.
    return () => clearLead();
  }, []);

  const nextSteps = [
    {
      icon: Mail,
      label: "Receipt on the way",
      body: `Stripe is sending a receipt to ${lead?.email ?? "your email"}. Save it for your business records.`,
    },
    {
      icon: BookOpen,
      label: "Your course unlocks now",
      body: "Login details for your course library arrive within 2 minutes.",
    },
    {
      icon: Calendar,
      label: "Start when you're ready",
      body: "Lifetime access — no rush. Most owners start with Module 01 the day they enroll.",
    },
  ];

  return (
    <section className="max-w-[720px] mx-auto px-6 py-16 md:py-24 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 border-2 border-success/30 mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 size={42} className="text-success" strokeWidth={2} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mb-3"
      >
        You're enrolled.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-[17px] text-muted-foreground leading-relaxed mb-10"
      >
        Thanks for your purchase. Everything you need is on its way.
      </motion.p>

      <div className="grid gap-4 text-left mb-10">
        {nextSteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              className="card-base p-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-subtle border border-gold-tint flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold" strokeWidth={2} />
              </div>
              <div>
                <h4 className="mb-1">{s.label}</h4>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          );
        })}

        {(referralStatus === "recorded" || referralStatus === "already") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="card-base p-5 flex items-start gap-4 bg-gold-subtle border-gold-tint"
          >
            <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold flex items-center justify-center shrink-0">
              <Gift size={18} className="text-gold" strokeWidth={2} />
            </div>
            <div>
              <h4 className="mb-1">Your invite was applied.</h4>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Want to do the same? Get your own code on the{" "}
                <Link to="/refer" className="text-navy underline font-semibold">
                  refer page
                </Link>{" "}
                — $25 cash per friend who enrolls.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {sessionId && (
        <p className="text-[11px] text-muted-foreground mb-6">
          Confirmation:{" "}
          <code className="text-[11px] bg-surface px-1.5 py-0.5 rounded">
            {sessionId.slice(0, 24)}…
          </code>
        </p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link to="/curriculum" className="btn-gold hover:btn-gold-hover">
          Start Module 01
          <ArrowRight size={16} />
        </Link>
        <Link to="/refer" className="btn-outline hover:btn-outline-hover">
          <Gift size={14} />
          Refer & earn $25
        </Link>
      </motion.div>
    </section>
  );
}
