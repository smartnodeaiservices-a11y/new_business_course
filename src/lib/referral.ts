// Client-side referral helpers.
//
// A referee's code is captured the moment they land on `/refer/:code` and
// persisted to localStorage (and a cookie for SSR-friendly readers).
// During checkout it is forwarded to Stripe via the session `metadata`.
// On /success the browser POSTs the code + Stripe session_id to the
// `record-referral` Edge Function which verifies + records the conversion.
//
// Code allocation runs entirely client-side against the `referrals` table —
// the RLS policy added in 20260514080000_referrals_client_writes.sql pins
// money/status fields to their safe defaults so a malicious client cannot
// inflate their own balance.

import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "nbc:referral";
const COOKIE_KEY = "nbc_referral";
const COOKIE_TTL_DAYS = 30;

export const REFERRAL_QUERY_PARAM = "via";

export type Referral = {
  code: string;
  owner_name: string | null;
  count: number;
  total_earned_cents: number;
  commission_cents: number;
  referee_discount_cents: number;
  status: string;
  referred_by_code?: string | null;
};

// Friendly 7-char code: avoids ambiguous chars (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateCode(): string {
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

const REFERRAL_COLUMNS =
  "code, owner_name, count, total_earned_cents, commission_cents, referee_discount_cents, status, referred_by_code";

// The generated supabase types haven't been regenerated since the `referrals`
// table (and the new `referred_by_code` column) were added, so we cast through
// `unknown` to a narrow shape rather than fighting them.
type FromTable = {
  select: (cols: string) => {
    eq: (
      col: string,
      val: string,
    ) => {
      maybeSingle: () => Promise<{ data: Referral | null; error: { message: string } | null }>;
    };
  };
  insert: (row: Record<string, unknown>) => {
    select: (cols: string) => {
      single: () => Promise<{
        data: Referral | null;
        error: { message: string; code?: string } | null;
      }>;
    };
  };
};
function table(name: string): FromTable {
  return (supabase.from as unknown as (t: string) => FromTable)(name);
}

/** Persists a referral code locally for later checkout metadata pickup. */
export function captureReferralCode(rawCode: string): string | null {
  const code = (rawCode || "").trim().toUpperCase();
  if (!/^[A-Z2-9]{4,10}$/.test(code)) return null;
  try {
    localStorage.setItem(STORAGE_KEY, code);
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(code)};max-age=${COOKIE_TTL_DAYS * 86400};path=/;samesite=Lax`;
  } catch {
    // storage may be disabled — non-fatal
  }
  return code;
}

export function readReferralCode(): string | null {
  try {
    const ls = localStorage.getItem(STORAGE_KEY);
    if (ls) return ls;
  } catch {
    // ignore
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearReferralCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  document.cookie = `${COOKIE_KEY}=;max-age=0;path=/`;
}

/**
 * Look up a referral by its code — used on `/refer/:code` to greet the
 * referee with the referrer's first name (if available) and the discount.
 */
export async function fetchReferralByCode(code: string): Promise<Referral | null> {
  const c = code.trim().toUpperCase();
  if (!c) return null;
  const { data, error } = await table("referrals")
    .select(REFERRAL_COLUMNS)
    .eq("code", c)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/**
 * Create or fetch a referral code for the given email. Runs entirely
 * client-side. Idempotent — calling twice with the same email returns the
 * same code.
 *
 * If `referredByCode` is supplied (typically `readReferralCode()` — the code
 * captured when the visitor landed via `/refer/:code`) we link the new code
 * back to its referrer so we can show "X invited you" on the dashboard and
 * later credit the conversion chain.
 */
export async function claimReferral(
  email: string,
  name?: string,
  referredByCode?: string | null,
): Promise<{ referral: Referral; created: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Valid email is required.");
  }
  const normalizedName = name?.trim() || null;
  const linkBack = referredByCode?.trim().toUpperCase() || null;

  // 1. Already have a code for this email? Return it as-is.
  const { data: existing } = await table("referrals")
    .select(REFERRAL_COLUMNS)
    .eq("owner_email", normalizedEmail)
    .maybeSingle();
  if (existing) {
    return { referral: existing, created: false };
  }

  // 2. Insert with retry on the rare code collision (~1 in 31^7).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await table("referrals")
      .insert({
        code,
        owner_email: normalizedEmail,
        owner_name: normalizedName,
        referred_by_code: linkBack,
      })
      .select(REFERRAL_COLUMNS)
      .single();
    if (!error && data) {
      return { referral: data, created: true };
    }
    if (error && /duplicate|unique|23505/i.test(error.message ?? "")) {
      // Collision on `code` PK — retry. Collision on owner_email means
      // someone raced us between step 1 and 2 — re-fetch and return.
      if (/owner_email/i.test(error.message)) {
        const { data: raced } = await table("referrals")
          .select(REFERRAL_COLUMNS)
          .eq("owner_email", normalizedEmail)
          .maybeSingle();
        if (raced) return { referral: raced, created: false };
      }
      continue;
    }
    if (error) throw new Error(error.message);
  }

  throw new Error("Could not allocate a referral code. Please try again.");
}

export async function recordConversion(
  stripeSessionId: string,
  referralCode: string,
): Promise<{ recorded: boolean; alreadyRecorded?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke<{
      ok: boolean;
      alreadyRecorded?: boolean;
      error?: string;
    }>("record-referral", {
      body: { stripeSessionId, referralCode },
    });
    if (error) return { recorded: false, error: error.message };
    return { recorded: !!data?.ok, alreadyRecorded: data?.alreadyRecorded };
  } catch (err) {
    return {
      recorded: false,
      error: err instanceof Error ? err.message : "Network error recording referral.",
    };
  }
}

/** Format $XX.00 from cents. */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  })}`;
}

/** Build a shareable URL for a code. */
export function shareableUrl(code: string): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://newbusinesscourse.com";
  return `${origin}/refer/${code}`;
}
