// Supabase Edge Function: record-referral
//
// Called from /success after a Stripe checkout completes. Verifies the
// Stripe session was paid, then records a referral_conversion row and
// increments the referrer's count + total_earned_cents.
//
// Idempotent: stripe_session_id is UNIQUE in the DB, so retries no-op.
//
// Required secrets:
//   STRIPE_SECRET_KEY            sk_live_ / sk_test_
//   SUPABASE_SERVICE_ROLE_KEY    (set automatically by Supabase)
//   SUPABASE_URL                 (set automatically by Supabase)

import Stripe from "https://esm.sh/stripe@17?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type RequestBody = {
  stripeSessionId: string;
  referralCode: string;
};

const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = ALLOWED.length === 0 || (origin && ALLOWED.includes(origin)) ? (origin ?? "*") : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

function json(body: unknown, init: ResponseInit & { origin: string | null }) {
  const { origin, ...rest } = init;
  return new Response(JSON.stringify(body), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
      ...(rest.headers ?? {}),
    },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, origin });
  }
  if (!STRIPE_SECRET) {
    return json({ error: "STRIPE_SECRET_KEY not configured" }, { status: 500, origin });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, origin });
  }

  const { stripeSessionId, referralCode } = body;
  if (!stripeSessionId || !referralCode) {
    return json(
      { error: "stripeSessionId and referralCode are required" },
      { status: 400, origin },
    );
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  // 1. Idempotency — if we already recorded this session, return existing row.
  const { data: existing } = await sb
    .from("referral_conversions")
    .select("id, referral_code, status, commission_cents, amount_cents")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();
  if (existing) {
    return json({ ok: true, conversion: existing, alreadyRecorded: true }, {
      status: 200,
      origin,
    });
  }

  // 2. Look up the referrer.
  const { data: referrer, error: refError } = await sb
    .from("referrals")
    .select("code, commission_cents, status")
    .eq("code", referralCode.toUpperCase())
    .maybeSingle();
  if (refError) return json({ error: refError.message }, { status: 500, origin });
  if (!referrer) {
    return json({ error: "Unknown referral code" }, { status: 404, origin });
  }
  if (referrer.status !== "active") {
    return json({ error: "Referral code is not active" }, { status: 400, origin });
  }

  // 3. Verify with Stripe.
  const stripe = new Stripe(STRIPE_SECRET);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(stripeSessionId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe lookup failed";
    return json({ error: msg }, { status: 502, origin });
  }
  if (session.payment_status !== "paid") {
    return json(
      { error: `Session not paid (status=${session.payment_status})` },
      { status: 400, origin },
    );
  }

  const amountCents = session.amount_total ?? 0;
  const product =
    (session.metadata?.product as string | undefined) ?? "new-business-course";
  const refereeEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const refereeName = session.customer_details?.name ?? null;
  const commissionCents = referrer.commission_cents;

  // 4. Record the conversion.
  const { data: conv, error: insertError } = await sb
    .from("referral_conversions")
    .insert({
      referral_code: referrer.code,
      stripe_session_id: stripeSessionId,
      referee_email: refereeEmail,
      referee_name: refereeName,
      product,
      amount_cents: amountCents,
      commission_cents: commissionCents,
      status: "pending",
    })
    .select()
    .single();
  if (insertError) {
    // Concurrent retry — fetch the inserted row and return it.
    if (/duplicate|unique/i.test(insertError.message)) {
      const { data: row } = await sb
        .from("referral_conversions")
        .select("*")
        .eq("stripe_session_id", stripeSessionId)
        .maybeSingle();
      return json({ ok: true, conversion: row, alreadyRecorded: true }, {
        status: 200,
        origin,
      });
    }
    return json({ error: insertError.message }, { status: 500, origin });
  }

  // 5. Increment aggregate counters on the referrer row.
  //    (Best-effort — the canonical totals can always be recomputed from
  //    referral_conversions if these drift.)
  await sb.rpc("noop").catch(() => {}); // no-op to keep types happy
  const { data: aggData } = await sb
    .from("referrals")
    .select("count, total_earned_cents")
    .eq("code", referrer.code)
    .maybeSingle();
  if (aggData) {
    await sb
      .from("referrals")
      .update({
        count: aggData.count + 1,
        total_earned_cents: aggData.total_earned_cents + commissionCents,
      })
      .eq("code", referrer.code);
  }

  return json({ ok: true, conversion: conv }, { status: 200, origin });
});
