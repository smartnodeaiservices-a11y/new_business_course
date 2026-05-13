// Client-side referral helpers.
//
// A referee's code is captured the moment they land on `/refer/:code` and
// persisted to localStorage (and a cookie for SSR-friendly readers).
// During checkout it is forwarded to Stripe via the session `metadata`.
// On /success the browser POSTs the code + Stripe session_id to the
// `record-referral` Edge Function which verifies + records the conversion.

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
};

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
  // Cast around the stale generated types — `referrals` table was added in
  // a later migration than supabase/types.ts was generated from.
  const from = supabase.from as unknown as (t: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: Referral | null; error: unknown }>;
      };
    };
  };
  const { data, error } = await from("referrals")
    .select(
      "code, owner_name, count, total_earned_cents, commission_cents, referee_discount_cents, status",
    )
    .eq("code", c)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/** Create or fetch a referral code for the given email (uses Edge Function). */
export async function claimReferral(
  email: string,
  name?: string,
): Promise<{ referral: Referral; created: boolean }> {
  const { data, error } = await supabase.functions.invoke<{
    ok: boolean;
    referral: Referral;
    created?: boolean;
    error?: string;
  }>("claim-referral", {
    body: { email, name },
  });
  if (error) throw new Error(error.message);
  if (!data?.ok || !data.referral) throw new Error(data?.error ?? "Could not claim a code.");
  return { referral: data.referral, created: !!data.created };
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
