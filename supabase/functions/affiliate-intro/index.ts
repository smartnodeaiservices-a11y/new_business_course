// Supabase Edge Function: affiliate-intro
//
// Receives an affiliate-intro form submission from the New Business Course
// module pages. Records the request in `affiliate_intros` and sends an
// introduction email to the requester with the affiliate CC'd.
//
// Required Supabase secrets (set via `supabase secrets set` — NEVER commit):
//   RESEND_API_KEY     re_...   (https://resend.com — free tier works)
//   INTRO_FROM_EMAIL   e.g. "New Business Course <intros@newbusinesscourse.com>"
//
// Optional:
//   ALLOWED_ORIGINS    comma-separated list of allowed Origin headers.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type RequestBody = {
  partner: string;
  affiliateEmail: string;
  source?: string;
  name: string;
  email: string;
  businessName?: string;
  context?: string;
};

const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("INTRO_FROM_EMAIL") ?? "New Business Course <intros@newbusinesscourse.com>";
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

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
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

  const { partner, affiliateEmail, source, name, email, businessName, context } = body;
  if (!partner || !affiliateEmail || !name || !email) {
    return json(
      { error: "partner, affiliateEmail, name, email are required" },
      { status: 400, origin },
    );
  }
  if (!isValidEmail(email) || !isValidEmail(affiliateEmail)) {
    return json({ error: "Invalid email" }, { status: 400, origin });
  }

  // 1. Record the request in DB (best-effort).
  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: row, error: insertError } = await sb
    .from("affiliate_intros")
    .insert({
      partner,
      affiliate_email: affiliateEmail,
      source: source ?? "module-handout",
      requester_name: name,
      requester_email: email,
      business_name: businessName ?? null,
      context: context ?? null,
      status: RESEND_KEY ? "pending" : "pending-no-email-provider",
    })
    .select("id")
    .single();
  if (insertError) {
    console.error("[affiliate-intro] insert failed:", insertError.message);
  }

  // 2. Send the email via Resend (if configured).
  if (!RESEND_KEY) {
    return json(
      {
        ok: true,
        warning: "RESEND_API_KEY not set — request recorded but no email sent.",
        id: row?.id,
      },
      { status: 200, origin },
    );
  }

  const subject = `Intro: ${esc(name)} ↔ ${esc(partner)}`;
  const contextLine = context ? `<p><strong>Note from ${esc(name)}:</strong> ${esc(context)}</p>` : "";
  const businessLine = businessName ? `<p><strong>Business:</strong> ${esc(businessName)}</p>` : "";

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1c1e;max-width:620px;margin:0 auto;padding:16px 8px;">
      <p>Hi ${esc(name)} and team at ${esc(partner)},</p>
      <p>Quick intro — ${esc(name)} is going through the
        <strong>New Business Course</strong> and wanted to connect with ${esc(partner)}
        about something covered in one of the modules.</p>
      ${businessLine}
      ${contextLine}
      <p>${esc(name)} — ${esc(partner)} is CC'd here. Reply all and you'll be talking
        directly.</p>
      <p>Thanks,<br/>The New Business Course team</p>
      <hr style="border:none;border-top:1px solid #efeee9;margin:24px 0;" />
      <p style="font-size:12px;color:#6b7280;">
        Source: ${esc(source ?? "module-handout")} · Request ID: ${esc(row?.id ?? "n/a")}
      </p>
    </div>
  `;

  const resendBody = {
    from: FROM,
    to: [email],
    cc: [affiliateEmail],
    subject,
    html,
    reply_to: affiliateEmail,
  };

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resendBody),
  });

  if (!resp.ok) {
    const errBody = await resp.text();
    console.error("[affiliate-intro] resend failed:", resp.status, errBody);
    if (row?.id) {
      await sb
        .from("affiliate_intros")
        .update({ status: "email-failed" })
        .eq("id", row.id);
    }
    return json(
      { error: "Email send failed", detail: errBody },
      { status: 502, origin },
    );
  }

  if (row?.id) {
    await sb
      .from("affiliate_intros")
      .update({ status: "emailed", emailed_at: new Date().toISOString() })
      .eq("id", row.id);
  }

  return json({ ok: true, id: row?.id }, { status: 200, origin });
});
