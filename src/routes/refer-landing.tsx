import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Award, BadgeCheck, Check, Gift, Shield } from "lucide-react";
import { usePageMeta } from "@/lib/page-meta";
import {
  captureReferralCode,
  fetchReferralByCode,
  formatCents,
  type Referral,
} from "@/lib/referral";
import { COURSE_META, COURSE_MODULES } from "@/lib/curriculum";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export default function ReferLandingPage() {
  const { code = "" } = useParams<{ code: string }>();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [state, setState] = useState<"loading" | "valid" | "invalid">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetchReferralByCode(code);
      if (cancelled) return;
      if (r && r.status === "active") {
        captureReferralCode(r.code);
        setReferral(r);
        setState("valid");
      } else {
        setState("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const refereeDiscount = referral?.referee_discount_cents ?? 2500;
  const discountedPriceCents = Math.max(0, COURSE_META.priceCents - refereeDiscount);
  const referrerFirst = referral?.owner_name?.split(" ")[0] ?? "A business owner";

  usePageMeta({
    title:
      state === "valid"
        ? `${referrerFirst} invited you — save ${formatCents(refereeDiscount)}`
        : `Referral link — ${COURSE_META.brand}`,
    description: `${COURSE_META.productTitle} — ${COURSE_META.moduleCount} CPA-built modules. Save ${formatCents(refereeDiscount)} with this invite.`,
  });

  return (
    <>
      <section className="bg-warm-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-14">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-start">
            <motion.div {...fadeUp}>
              <span className="chip mb-5">
                <Gift size={12} />
                Invitation · {code.toUpperCase()}
              </span>

              {state === "loading" && (
                <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3.25rem)]! leading-[1.05]!">
                  Loading your invite…
                </h1>
              )}

              {state === "invalid" && (
                <>
                  <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3rem)]! leading-[1.05]!">
                    That invite isn't active.
                  </h1>
                  <p className="text-[16px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
                    The link may have expired or been mistyped. You can still
                    enroll at the regular price — most owners earn it back in
                    the first quarter.
                  </p>
                  <Link to="/curriculum" className="btn-gold hover:btn-gold-hover">
                    See the 15 modules
                    <ArrowRight size={15} />
                  </Link>
                </>
              )}

              {state === "valid" && (
                <>
                  <h1 className="mb-4 text-[clamp(2rem,3.6vw+0.5rem,3.25rem)]! leading-[1.05]!">
                    {referrerFirst} invited you. <br className="hidden sm:block" />
                    Save{" "}
                    <span className="text-gold">
                      {formatCents(refereeDiscount)}
                    </span>{" "}
                    on the course.
                  </h1>
                  <p className="text-[16.5px] text-muted-foreground leading-relaxed mb-6 max-w-xl">
                    {COURSE_META.productTitle} — {COURSE_META.moduleCount} modules
                    built by a CPA firm for first-year U.S. business owners. Your
                    invite is auto-applied at checkout.
                  </p>
                  <ul className="space-y-2 mb-6 max-w-md">
                    {[
                      `${COURSE_META.moduleCount} CPA-built video modules`,
                      "Downloadable handout per module",
                      "Lifetime access — updated annually",
                      `${COURSE_META.guarantee}`,
                    ].map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[14.5px] text-foreground"
                      >
                        <Check size={16} className="text-gold mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/enroll?course=new-business-blueprint&via=${encodeURIComponent(
                        referral!.code,
                      )}`}
                      className="btn-gold hover:btn-gold-hover px-7! text-[15px]!"
                    >
                      Claim my {formatCents(refereeDiscount)} off
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/curriculum"
                      className="btn-outline hover:btn-outline-hover"
                    >
                      Preview the curriculum
                    </Link>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground mt-5 inline-flex items-center gap-1.5">
                    <Shield size={13} className="text-gold" />
                    Discount auto-applies at checkout · {COURSE_META.guarantee}
                  </p>
                </>
              )}
            </motion.div>

            {state === "valid" && (
              <motion.div {...fadeUp}>
                <div className="card-base p-7 bg-gold-subtle border-gold-tint relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <BadgeCheck size={20} className="text-gold" />
                  </div>
                  <p className="eyebrow mb-3 text-gold!">Your invite price</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[44px] font-bold text-navy leading-none tabular-nums">
                      {formatCents(discountedPriceCents)}
                    </span>
                    <span className="text-[18px] text-muted-foreground line-through">
                      {COURSE_META.price}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-5">
                    One-time. Lifetime access. {COURSE_META.guarantee}.
                  </p>
                  <div className="border-t border-gold-tint pt-4 flex items-center gap-3 text-[12.5px] text-foreground">
                    <Award size={14} className="text-gold" />
                    Includes all {COURSE_META.moduleCount} modules + intro video
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {state === "valid" && (
        <section className="bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-14">
            <motion.div {...fadeUp} className="max-w-2xl mb-8">
              <p className="eyebrow mb-3">What's in the course</p>
              <h2 className="text-[26px]! md:text-[28px]! mb-3">
                {COURSE_META.moduleCount} modules. Day one to exit.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {COURSE_MODULES.map((m) => (
                <div
                  key={m.slug}
                  className="card-base p-4 bg-white flex items-start gap-3"
                >
                  <span className="text-[18px] font-bold text-gold tabular-nums shrink-0">
                    {String(m.number).padStart(2, "0")}
                  </span>
                  <h4 className="m-0! text-[14.5px]!">{m.title}</h4>
                </div>
              ))}
            </motion.div>
            <div className="mt-10 text-center">
              <Link
                to={`/enroll?course=new-business-blueprint&via=${encodeURIComponent(
                  referral!.code,
                )}`}
                className="btn-gold hover:btn-gold-hover px-8! text-[15px]!"
              >
                Enroll with {formatCents(refereeDiscount)} off
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
