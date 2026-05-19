// Admin analytics — single round-trip to the `get_admin_analytics` RPC which
// returns leads + referrals + conversions + totals in one JSONB blob. The
// underlying tables (`public.leads`, `public.referral_conversions`) have no
// public SELECT policy, so this RPC is the only way to read them from the
// browser. The token lives in `public.app_settings` and is rotated by hand.
// See: supabase/migrations/20260515090000_admin_analytics.sql

import { supabase } from "./client";

export type AnalyticsLead = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  segment: string | null;
  pain: string | null;
  estimate: number | null;
  status: string;
  paid_at: string | null;
  created_at: string;
  stripe_session_id: string | null;
};

export type AnalyticsReferral = {
  code: string;
  owner_email: string;
  owner_name: string | null;
  count: number;
  total_earned_cents: number;
  commission_cents: number;
  status: string;
  created_at: string;
};

export type AnalyticsConversion = {
  id: string;
  referral_code: string;
  referee_email: string | null;
  referee_name: string | null;
  product: string | null;
  amount_cents: number | null;
  commission_cents: number;
  status: string;
  created_at: string;
};

export type AnalyticsTotals = {
  total_leads: number;
  paid_leads: number;
  unpaid_leads: number;
  leads_last_7d: number;
  estimated_value_cents: number;
  referrers: number;
  referral_conversions: number;
  referral_revenue_cents: number;
};

export type AdminAnalytics = {
  totals: AnalyticsTotals;
  leads: AnalyticsLead[];
  referrals: AnalyticsReferral[];
  conversions: AnalyticsConversion[];
};

// Shared cast — the generated Database type doesn't know about these custom
// RPCs, so we widen the client locally rather than pollute the global types.
type RpcClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function fetchAdminAnalytics(token: string): Promise<AdminAnalytics> {
  const client = supabase as unknown as RpcClient;
  const { data, error } = await client.rpc("get_admin_analytics", {
    p_token: token,
  });

  if (error) {
    // Surface "Unauthorized" cleanly so the page can prompt for a new password.
    if (/unauthorized/i.test(error.message)) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(error.message || "Failed to load analytics");
  }
  if (!data || typeof data !== "object") {
    throw new Error("Analytics RPC returned an unexpected payload");
  }
  return data as AdminAnalytics;
}

/**
 * Rotates the admin password. Verifies the current password server-side,
 * then writes the new one. Returns the new password so the caller can
 * update its stored copy.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  const client = supabase as unknown as RpcClient;
  const { data, error } = await client.rpc("set_admin_token", {
    p_current: currentPassword,
    p_new: newPassword,
  });

  if (error) {
    if (/unauthorized/i.test(error.message)) {
      throw new Error("Current password is incorrect.");
    }
    throw new Error(error.message || "Failed to update password");
  }
  if (data !== true) {
    throw new Error("Password change failed.");
  }
  return newPassword;
}
