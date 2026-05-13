// Supabase Edge Function: claim-referral
//
// Returns (creating if necessary) a unique referral code for the given email.
// Idempotent — calling twice with the same email returns the same code.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type RequestBody = {
  email: string;
  name?: string;
};

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Friendly 7-char code: avoids ambiguous chars (0/O, 1/I/L).
function generateCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, origin });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, origin });
  }

  if (!body.email || !isValidEmail(body.email)) {
    return json({ error: "Valid email is required" }, { status: 400, origin });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const email = body.email.trim().toLowerCase();
  const name = body.name?.trim() ?? null;

  // 1. Already have a code? Return it.
  const { data: existing, error: fetchError } = await sb
    .from("referrals")
    .select("code, owner_name, count, total_earned_cents, commission_cents, referee_discount_cents, status")
    .eq("owner_email", email)
    .maybeSingle();
  if (fetchError) {
    return json({ error: fetchError.message }, { status: 500, origin });
  }
  if (existing) {
    // Backfill owner_name on first dashboard visit if it was empty.
    if (!existing.owner_name && name) {
      await sb.from("referrals").update({ owner_name: name }).eq("code", existing.code);
    }
    return json({ ok: true, referral: existing }, { status: 200, origin });
  }

  // 2. Insert with retry on collision (extremely rare).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await sb
      .from("referrals")
      .insert({
        code,
        owner_email: email,
        owner_name: name,
      })
      .select("code, owner_name, count, total_earned_cents, commission_cents, referee_discount_cents, status")
      .single();
    if (!error && data) {
      return json({ ok: true, referral: data, created: true }, { status: 200, origin });
    }
    // 23505 = unique_violation. Retry with a new code.
    if (error && /duplicate|unique/i.test(error.message)) continue;
    if (error) return json({ error: error.message }, { status: 500, origin });
  }

  return json(
    { error: "Could not allocate a referral code, try again." },
    { status: 500, origin },
  );
});
