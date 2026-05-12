// Supabase Edge Function: create-checkout-session
//
// Creates a Stripe Checkout Session and returns its URL. The browser then
// navigates to that URL to start payment.
//
// Each line item is built from the database (name + amount in cents), so
// you don't have to pre-create products/prices in the Stripe dashboard.
// Optionally a pre-defined Stripe Price ID can still be passed via `priceId`.
//
// Required Supabase secrets (set via `supabase secrets set` — NEVER commit):
//   STRIPE_SECRET_KEY   sk_live_... or sk_test_...
//
// Optional:
//   ALLOWED_ORIGINS     comma-separated list of allowed Origin headers
//                       (e.g. "https://example.com,http://localhost:5173").
//                       If unset, all origins are allowed (fine for dev).

import Stripe from "https://esm.sh/stripe@17?target=deno";

type LineItem = {
  // Path A — pre-defined Stripe price (optional, rarely used)
  priceId?: string;
  // Path B — build the price on the fly from the DB
  name?: string;
  amountCents?: number;
  description?: string;
  currency?: string; // defaults to "usd"
  quantity?: number;
};

type RequestBody = {
  lineItems: LineItem[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

const SECRET = Deno.env.get("STRIPE_SECRET_KEY");
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

  if (!SECRET) {
    return json(
      { error: "STRIPE_SECRET_KEY is not set on the Edge Function." },
      { status: 500, origin },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, origin });
  }

  const { lineItems, customerEmail, successUrl, cancelUrl, metadata } = body;

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return json({ error: "lineItems is required" }, { status: 400, origin });
  }
  if (!successUrl || !cancelUrl) {
    return json({ error: "successUrl and cancelUrl are required" }, { status: 400, origin });
  }

  // Build Stripe line items — either a pre-defined price or an ad-hoc price_data.
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const li of lineItems) {
    const quantity = li.quantity ?? 1;

    if (li.priceId) {
      if (!li.priceId.startsWith("price_")) {
        return json({ error: `Invalid priceId: ${li.priceId}` }, { status: 400, origin });
      }
      stripeLineItems.push({ price: li.priceId, quantity });
      continue;
    }

    // Ad-hoc price built from DB values.
    if (!li.name || typeof li.amountCents !== "number" || li.amountCents <= 0) {
      return json(
        {
          error:
            "Each line item needs either { priceId } or { name, amountCents } (amount > 0).",
        },
        { status: 400, origin },
      );
    }

    stripeLineItems.push({
      quantity,
      price_data: {
        currency: (li.currency ?? "usd").toLowerCase(),
        unit_amount: Math.round(li.amountCents),
        product_data: {
          name: li.name,
          ...(li.description ? { description: li.description } : {}),
        },
      },
    });
  }

  const stripe = new Stripe(SECRET, { apiVersion: "2024-10-28.acacia" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata,
      allow_promotion_codes: true,
    });

    return json({ id: session.id, url: session.url }, { status: 200, origin });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[create-checkout-session]", message);
    return json({ error: message }, { status: 500, origin });
  }
});
