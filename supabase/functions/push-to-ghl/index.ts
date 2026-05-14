// Supabase Edge Function: push-to-ghl
//
// Records a lead in GHL — upserts the contact and creates an opportunity in
// the configured pipeline/stage. Stripe is NOT involved here — the existing
// app handles checkout; this function just mirrors the lead into GHL.
//
// Called from two places:
//   1. `persistLeadToSupabase` (src/lib/lead.ts) — fires the moment the user
//      enters their email anywhere on the funnel, so they land in the
//      "New Lead" stage right away.
//   2. /success — fires again after a successful checkout, so amount + status
//      get attached to the same contact (the upsert prevents duplicates).
//
// Idempotency:
//   * supabase.leads.ghl_synced_at — set after a successful push so refresh
//     loops don't create duplicate opportunities.
//   * GHL contacts/upsert dedupes by email, so the same buyer is never two
//     contacts.
//
// Required secrets (set on Supabase):
//   GHL_PIT_TOKEN                pit-…  (Private Integration Token, v2 API)
//   GHL_LOCATION_ID              v2 location id
//   GHL_PIPELINE_ID              opportunity pipeline id
//   GHL_STAGE_ID                 stage id inside that pipeline (the "new lead" stage)
//
// Optional secrets:
//   ALLOWED_ORIGINS              comma-separated CORS allowlist
//   GHL_OPPORTUNITY_SOURCE       defaults to "New Business Course"
//   GHL_TAGS                     comma-separated, defaults to "enrolled,new-business-course"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GHL_TOKEN = Deno.env.get("GHL_PIT_TOKEN");
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID");
const GHL_PIPELINE_ID = Deno.env.get("GHL_PIPELINE_ID");
const GHL_STAGE_ID = Deno.env.get("GHL_STAGE_ID");
const GHL_OPP_SOURCE = Deno.env.get("GHL_OPPORTUNITY_SOURCE") ?? "New Business Course";
const GHL_TAGS = (Deno.env.get("GHL_TAGS") ?? "enrolled,new-business-course")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);
const GHL_VERSION = "2021-07-28";
const GHL_BASE = "https://services.leadconnectorhq.com";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

type RequestBody = {
  email: string;
  name?: string | null;
  phone?: string | null;
  source?: string | null;
  /** Optional — set when the lead is becoming a customer. */
  amountCents?: number;
  stripeSessionId?: string | null;
  /** "new" (default), "paid", "lead", "enrolled" — passed through as a GHL tag. */
  status?: string | null;
  /** Extra GHL tags to apply on top of GHL_TAGS. */
  extraTags?: string[];
};

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    ALLOWED.length === 0 || (origin && ALLOWED.includes(origin)) ? (origin ?? "*") : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
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

function splitName(full?: string | null): { firstName: string; lastName: string } {
  if (!full) return { firstName: "", lastName: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function ghlFetch(path: string, body: unknown): Promise<Response> {
  return fetch(`${GHL_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_TOKEN}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function upsertContact(args: {
  email: string;
  name?: string | null;
  phone?: string | null;
  source: string;
  tags: string[];
}): Promise<string> {
  const { firstName, lastName } = splitName(args.name);
  const payload = {
    locationId: GHL_LOCATION_ID,
    email: args.email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    phone: args.phone || undefined,
    name: args.name || undefined,
    source: args.source,
    tags: args.tags,
  };
  const res = await ghlFetch("/contacts/upsert", payload);
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : `GHL contacts/upsert failed (${res.status})`;
    throw new Error(`${msg} :: ${JSON.stringify(data)}`);
  }
  const contactObj =
    (data?.contact as Record<string, unknown> | undefined) ?? (data as Record<string, unknown>);
  const contactId = typeof contactObj?.id === "string" ? (contactObj.id as string) : "";
  if (!contactId) {
    throw new Error(`GHL contact upsert returned no id :: ${JSON.stringify(data)}`);
  }
  return contactId;
}

async function createOpportunity(args: {
  contactId: string;
  contactName: string;
  email: string;
  amountCents: number;
  source: string;
}): Promise<string> {
  const payload = {
    pipelineId: GHL_PIPELINE_ID,
    pipelineStageId: GHL_STAGE_ID,
    locationId: GHL_LOCATION_ID,
    name: args.contactName || args.email,
    status: "open",
    contactId: args.contactId,
    monetaryValue: args.amountCents > 0 ? args.amountCents / 100 : 0,
    source: args.source,
  };
  const res = await ghlFetch("/opportunities/", payload);
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : `GHL opportunities create failed (${res.status})`;
    throw new Error(`${msg} :: ${JSON.stringify(data)}`);
  }
  const oppObj =
    (data?.opportunity as Record<string, unknown> | undefined) ?? (data as Record<string, unknown>);
  const opportunityId = typeof oppObj?.id === "string" ? (oppObj.id as string) : "";
  if (!opportunityId) {
    throw new Error(`GHL opportunity create returned no id :: ${JSON.stringify(data)}`);
  }
  return opportunityId;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, origin });
  }

  for (const [key, val] of Object.entries({
    GHL_PIT_TOKEN: GHL_TOKEN,
    GHL_LOCATION_ID,
    GHL_PIPELINE_ID,
    GHL_STAGE_ID,
  })) {
    if (!val) {
      return json({ error: `Missing required secret: ${key}` }, { status: 500, origin });
    }
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, origin });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return json({ error: "Valid email is required" }, { status: 400, origin });
  }
  const name = body.name?.trim() || null;
  const phone = body.phone?.trim() || null;
  const status = body.status?.trim() || "new";
  const amountCents = typeof body.amountCents === "number" ? body.amountCents : 0;
  const stripeSessionId = body.stripeSessionId?.trim() || null;
  const sourceLabel = body.source?.trim() || GHL_OPP_SOURCE;
  const tags = [...new Set([...GHL_TAGS, ...(body.extraTags ?? []), `status:${status}`])];

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Idempotency: if we already synced this email (or this Stripe session)
  // skip the opportunity create. The contact upsert is safe to repeat.
  const { data: existing } = await sb
    .from("leads")
    .select("id, ghl_synced_at, stripe_session_id, status")
    .eq("email", email)
    .maybeSingle();

  const alreadyPushed = !!existing?.ghl_synced_at;

  // Upsert the GHL contact every call so the latest name/phone/tags propagate.
  let contactId: string;
  try {
    contactId = await upsertContact({ email, name, phone, source: sourceLabel, tags });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "GHL contact upsert failed";
    return json({ error: msg }, { status: 502, origin });
  }

  // Create the opportunity only the first time we see this email.
  let opportunityId: string | null = null;
  if (!alreadyPushed) {
    try {
      opportunityId = await createOpportunity({
        contactId,
        contactName: name ?? email,
        email,
        amountCents,
        source: sourceLabel,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GHL opportunity create failed";
      return json({ error: msg }, { status: 502, origin });
    }
  }

  // Mirror the state back into supabase so future calls can stay idempotent.
  const nowIso = new Date().toISOString();
  const leadPatch: Record<string, unknown> = {
    email,
    name: name ?? undefined,
    phone: phone ?? undefined,
    status,
    ghl_synced_at: nowIso,
  };
  if (stripeSessionId) leadPatch.stripe_session_id = stripeSessionId;
  if (status === "paid" || amountCents > 0) leadPatch.paid_at = nowIso;

  if (existing) {
    await sb.from("leads").update(leadPatch).eq("id", existing.id);
  } else {
    await sb.from("leads").insert(leadPatch);
  }

  return json(
    {
      ok: true,
      contactId,
      opportunityId,
      alreadyInPipeline: alreadyPushed,
    },
    { status: 200, origin },
  );
});
